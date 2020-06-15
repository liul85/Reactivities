import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Label } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import { rootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValue } from "../../app/models/user";
import { FORMERR } from "dns";
import { combineValidators, isRequired } from "revalidate";

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
          [FORMERR]: error,
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
        <Form onSubmit={handleSubmit}>
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <Label color="red" basic content={submitError.statusText} />
          )}
          <br />
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content="Login"
          />
        </Form>
      )}
    />
  );
};
