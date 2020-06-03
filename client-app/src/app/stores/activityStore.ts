import { observable, action } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable editMode: boolean = false;
  @observable loadingInitial: boolean = false;

  @action loadActivities = () => {
    this.loadingInitial = true;
    agent.Activities.list()
      .then((activities) => {
        this.activities = activities.map((a) => {
          a.date = a.date.split(".")[0];
          return a;
        });
      })
      .finally(() => {
        this.loadingInitial = false;
      });
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => (a.id = id));
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
