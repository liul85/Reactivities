import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";
import { setActivityPros, createAttendee } from "../common/util/util";
import { toast } from "react-toastify";

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
  @observable loading: boolean = false;

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
          setActivityPros(activity, this.rootStore.userStore.user!);
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
        setActivityPros(activity, this.rootStore.userStore.user!);
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      activity.isGoing = true;
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (e) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem signing up to activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (e) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling attendance");
    }
  };
}
