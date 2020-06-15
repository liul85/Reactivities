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
      runInAction("User login", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      history.push("/activities");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (e) {
      console.error(e);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };
}
