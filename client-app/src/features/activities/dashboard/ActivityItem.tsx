import React from "react";
import { Item, Button, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProp {
  activity: IActivity;
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityItem: React.FC<IProp> = ({ activity, selectActivity, deleteActivity }) => {
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
          <Button color='red' floated='right' content='Delete' onClick={() => deleteActivity(activity.id)} />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};
