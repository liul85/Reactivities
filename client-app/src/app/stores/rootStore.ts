import UserStore from "./userStore";
import ActivityStore from "./activityStore";
import { createContext } from "react";
import { configure } from "mobx";

configure({ enforceActions: "always" });

export class RootStore {
  activityStore: ActivityStore;
  userStore: UserStore;
  constructor() {
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
  }
}

export const rootStoreContext = createContext(new RootStore());
