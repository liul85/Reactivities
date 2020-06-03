import React, { SyntheticEvent } from "react";
import { Item, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { ActivityItem } from "./ActivityItem";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target,
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}
            submitting={submitting}
            target={target}
          />
        ))}
      </Item.Group>
    </Segment>
  );
};
