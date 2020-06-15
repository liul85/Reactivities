import UserStore from "./userStore";
import ActivityStore from "./activityStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";

configure({ enforceActions: "always" });

export class RootStore {
  activityStore: ActivityStore;
  userStore: UserStore;
  commonStore: CommonStore;
  constructor() {
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
  }
}

export const rootStoreContext = createContext(new RootStore());
