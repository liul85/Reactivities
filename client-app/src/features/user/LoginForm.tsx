import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import { rootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValue } from "../../app/models/user";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { FORM_ERROR } from "final-form";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});

export const LoginForm = () => {
  const { userStore } = useContext(rootStoreContext);
  const { login } = userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValue) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid email or password"
            />
          )}
          <br />
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Login"
            fluid
          />
        </Form>
      )}
    />
  );
};
