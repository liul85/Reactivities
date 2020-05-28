import React from "react";
import { Item, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { ActivityItem } from "./ActivityItem";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityList: React.FC<IProps> = ({ activities, selectActivity, deleteActivity }) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} selectActivity={selectActivity} deleteActivity={deleteActivity} />
        ))}
      </Item.Group>
    </Segment>
  );
};
