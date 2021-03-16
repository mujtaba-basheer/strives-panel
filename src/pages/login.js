import React, { Component } from "react";
import apiCall from "../utils/apiCall";
import { message } from "antd";
import "antd/dist/antd.css";
import { withRouter, Link } from "react-router-dom";

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  login = async () => {
    try {
      let response = await apiCall.post("login", {
        email: this.state.email,
        password: this.state.password,
      });

      message.success("Login Successful");
      localStorage.setItem("userDetails", JSON.stringify(response.data.data));
      localStorage.setItem("token", response.data.token);
      setImmediate(() => this.props.history.push("/orders/list"));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="login-wrapper d-flex align-items-center justify-content-center">
          <div className="login-form-main-div">
            <div className="login-logo"></div>
            <h3>Welcome Back,</h3>
            <h5 className="mb-4">Please sign in</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.login();
              }}
            >
              <input
                type="email"
                placeholder="Enter email"
                className="form-input-field"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                required
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="form-input-field"
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
                required
              />
              <input
                type="submit"
                value="Login"
                className="form-input-button"
              />
            </form>
            <div className="forgot-password">
              <Link to="/forgot-password">
                <u>Forgot Password</u>?
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(login);
