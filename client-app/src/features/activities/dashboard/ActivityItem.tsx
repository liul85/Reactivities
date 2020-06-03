import React, { SyntheticEvent } from "react";
import { Item, Button, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";

interface IProp {
  activity: IActivity;
  selectActivity: (id: string) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityItem: React.FC<IProp> = ({
  activity,
  selectActivity,
  deleteActivity,
  submitting,
  target,
}) => {
  return (
    <Item key={activity.id}>
      <Item.Content>
        <Item.Header as="a">{activity.title}</Item.Header>
        <Item.Meta>{activity.date}</Item.Meta>
        <Item.Description>
          <div>{activity.description}</div>
          <div>
            {activity.city}, {activity.venue}
          </div>
        </Item.Description>
        <Item.Extra>
          <Button
            floated="right"
            content="View"
            color="blue"
            onClick={() => selectActivity(activity.id)}
          />
          <Button
            name={activity.id}
            loading={target === activity.id && submitting}
            color="red"
            floated="right"
            content="Delete"
            onClick={(e) => deleteActivity(e, activity.id)}
          />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default observer(ActivityItem);
