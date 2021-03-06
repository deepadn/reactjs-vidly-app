import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./common/input";

class LoginFormBeforeRefactoring extends Component {
  // we need to minimise the use of ref as much as possible
  // In input field refer to it as ref attribute
  //  username = React.createRef();

  //  componentDidMount() {
  //    // to set focus on username - alternative is to use autofocus in input field
  //    this.username.current.focus();
  //  }

  state = {
    account: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  validate = () => {
    const options = {
      abortEarly: false,
    };
    const { error } = Joi.validate(this.state.account, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;

    // validation without third party library like Joi-browser
    /*  const errors = {};
    const { account } = this.state;
    if (account.username.trim() === "") {
      errors.username = "Username is required.";
    }
    if (account.password.trim() === "") {
      errors.password = "Password is required.";
    }
    return Object.keys(errors).length === 0 ? null : errors; */
  };

  handleSubmit = (e) => {
    e.preventDefault();
    //accessing DOM elements in vanilla javascript, but this wont work in react as we should never work with document object as react'swhole point
    // is to put abstract around dom
    // const username = document.getElementById('username').nodeValue;
    // soln in react: creact reference object - line 5, and below is the way to access dom
    // const username = this.username.current.value;
    // console.log(username);

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //Call the server and save the changes
    console.log("Submitted");
  };

  validateProperty = ({ name, value }) => {
    // set object by computed properties
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;

    // property validation without third party libraries like Joi-browser
    /* if (name === "username") {
      if (value.trim() === "") return "Username is required.";
    }
    if (name === "password") {
      if (value.trim() === "") return "Password is required.";
    } */
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const account = { ...this.state.account };
    account[input.name] = input.value;

    this.setState({ account, errors });
  };

  render() {
    const { account, errors } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          name="username"
          label="Username"
          value={account.username}
          onChange={this.handleChange}
          error={errors.username}
        />
        <Input
          name="password"
          label="Password"
          value={account.password}
          onChange={this.handleChange}
          error={errors.password}
        />
        <button disabled={this.validate()} className="btn btn-primary">
          Login
        </button>
      </form>
    );
  }
}
export default LoginFormBeforeRefactoring;
