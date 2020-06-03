import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { List, Container } from "semantic-ui-react";
import "./style.css";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

interface IState {
  activities: IActivity[];
}

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((activity) => activity.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter((a) => a.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  const handleDeleteActivity = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id)
      .then(() => {
        setActivities(activities.filter((a) => a.id !== id));
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    agent.Activities.list()
      .then((data) => {
        setActivities(
          data.map((a) => {
            a.date = a.date.split(".")[0];
            return a;
          })
        );
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingComponent content="Loading Activities..." />;
  }

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <List>
          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
            target={target}
          />
        </List>
      </Container>
    </Fragment>
  );
};

export default App;
