import React from "react";
import { Item, Button, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProp {
  activity: IActivity;
}

export const ActivityItem: React.FC<IProp> = ({ activity }) => {
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
          <Button floated="right" content="View" color="blue" />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};
