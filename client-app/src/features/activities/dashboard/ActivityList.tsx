import React from "react";
import { Item, Image, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { ActivityItem } from "./ActivityItem";

interface IProps {
  activities: IActivity[];
}

export const ActivityList: React.FC<IProps> = ({ activities }) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activity) => (
          <ActivityItem activity={activity} />
        ))}
      </Item.Group>
    </Segment>
  );
};
