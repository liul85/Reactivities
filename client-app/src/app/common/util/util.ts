import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = `${time.getHours()}:${time.getMinutes()}:00`;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;

  const dateTimeString = `${dateString} ${timeString}`;
  return new Date(dateTimeString);
};

export const setActivityPros = (
  activity: IActivity,
  user: IUser
): IActivity => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.username === user.username
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user.username && a.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    username: user.username,
    displayName: user.displayName,
    image: user.image!,
    isHost: false,
  };
};
