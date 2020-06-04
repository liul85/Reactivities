import React, { useContext } from "react";
import { Item, Button, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

interface IProp {
  activity: IActivity;
}

const ActivityItem: React.FC<IProp> = ({ activity }) => {
  const { selectActivity, deleteActivity, submitting, target } = useContext(
    ActivityStore
  );
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
