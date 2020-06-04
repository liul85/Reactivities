import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map<string, IActivity>();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable editMode: boolean = false;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        runInAction("loading activities", () => {
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (e) {
      console.error(`Failed to get activites; ${e}`);
    } finally {
      runInAction("loading activities", () => (this.loadingInitial = false));
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activities", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (e) {
      console.error(`Error occured when creating new activity: ${e}`);
    } finally {
      runInAction("creating activities", () => (this.submitting = false));
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.editMode = true;
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (e) {
      console.error(`Failed to update activites; ${e}`);
    } finally {
      runInAction("editing activity", () => (this.submitting = false));
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
      runInAction("deleting activity", () => (this.submitting = false));
    }
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action closeForm = () => {
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
