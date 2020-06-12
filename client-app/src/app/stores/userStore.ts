import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValue } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;
  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValue) => {
    try {
      const user = await agent.User.login(values);
      console.log(user);
      runInAction("User login", () => {
        this.user = user;
        history.push("/activities");
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
