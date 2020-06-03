import React, { SyntheticEvent, useContext } from "react";
import { Item, Segment } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

interface IProps {
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityList: React.FC<IProps> = ({
  deleteActivity,
  submitting,
  target,
}) => {
  const { activities, selectActivity } = useContext(ActivityStore);
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

export default observer(ActivityList);
