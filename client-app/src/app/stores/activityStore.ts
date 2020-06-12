import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activities: IActivity[] = [];
  @observable activity: IActivity | undefined;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = "";

  @computed get activitiesByDate() {
    return this.groupActivities(Array.from(this.activityRegistry.values()));
  }

  groupActivities = (activities: IActivity[]) => {
    const sorted = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const reduced = sorted.reduce((activities, activity) => {
      const date = activity.date.toISOString().split("T")[0];
      activities[date] = activities[date]
        ? [...activities[date], activity]
        : [activity];
      return activities;
    }, {} as { [key: string]: IActivity[] });
    return Object.entries(reduced);
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (e) {
      console.error(`Failed to get activites; ${e}`);
    } finally {
      runInAction(() => (this.loadingInitial = false));
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return activity;
    }

    this.loadingInitial = true;
    try {
      let activity = await agent.Activities.details(id);
      runInAction("getting activity", () => {
        activity.date = new Date(activity.date);
        this.activity = activity;
        this.activityRegistry.set(activity.id, activity);
      });
      return activity;
    } catch (e) {
      console.error(`Error occured when getting activity: ${e}`);
    } finally {
      runInAction(() => (this.loadingInitial = false));
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activities", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (e) {
      console.error(`Error occured when creating new activity: ${e}`);
    } finally {
      runInAction(() => (this.submitting = false));
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (e) {
      console.error(`Failed to update activites; ${e}`);
    } finally {
      runInAction(() => (this.submitting = false));
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => this.activityRegistry.delete(id));
    } catch (e) {
      console.error(`Failed to delete activity; ${e}`);
    } finally {
      runInAction(() => (this.submitting = false));
    }
  };

  @action cleanActivity = () => {
    this.activity = undefined;
  };
}
