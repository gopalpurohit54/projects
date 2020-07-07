import React, { useState, useContext } from "react";

import Input from "../../shared/components/form/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE
} from "../../shared/components/utils/validators";
import { useForm } from "../../shared/components/hooks/FormHook";
import "../../shared/components/form/Button.css";
import Card from "../../shared/components/UIelement/Card";
import "./Auth.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIelement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelement/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/httpHook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        {
          "Content-Type": "application/json"
        }
      );
      auth.login(responseData.userID, responseData.token);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form id="myForm" onSubmit={placeSubmitHandler}>
          <Input
            id="email"
            element="input"
            type="text"
            label="E-MAIL"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid e-mail address."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid password."
            onInput={inputHandler}
          />
          <button
            type="submit"
            className={formState.isValid === true ? "to-btn" : ""}
            disabled={!formState.isValid}
          >
            Login
          </button>
          or
          <Link to="/signup"> Signup</Link>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
