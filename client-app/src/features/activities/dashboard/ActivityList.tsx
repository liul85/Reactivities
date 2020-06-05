import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList = () => {
  const { activitiesByDate } = useContext(ActivityStore);
  return (
    <Fragment>
      {activitiesByDate.map(([date, activities]) => (
        <Fragment key={date}>
          <Label size="large" color="blue">
            {date}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
