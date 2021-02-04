/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import apiCall from "../utils/apiCall";
import { message } from "antd";
import "antd/dist/antd.css";
import { withRouter, Link } from "react-router-dom";

class forgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      step: 1,
      email: "",
      otp: "",
      newPassword: "",
      reEnter: "",
    };
  }
  sendOtp = async () => {
    let response = await apiCall.post("sendOtp", {
      email: this.state.email,
    });
    if (response.data.status) {
      message.success("OTP Sent!");
      this.setState({ step: 2 });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  verifyEmail = async () => {
    let response = await apiCall.post("verifyEmail", {
      email: this.state.email,
      otp: parseInt(this.state.otp),
    });
    if (response.data.status) {
      message.success("Email Verified!");
      this.setState({ step: 3 });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  resetPassword = async () => {
    if (this.state.newPassword === this.state.reEnter) {
      let response = await apiCall.post("newresetPassword", {
        email: this.state.email,
        password: this.state.newPassword,
      });
      if (response.data.status) {
        message.success("Password Resetted!");
        window.location.href = "/login";
      } else {
        message.error(`${response.data.message}`);
      }
    } else {
      message.error("New Passwords Don't Match");
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="login-wrapper d-flex align-items-center justify-content-center">
          {this.state.step === 1 ? (
            <div className="login-form-main-div">
              <div className="login-logo"></div>
              <h3>Forgot your password?</h3>
              <h5 className="mb-4">We can help!</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.sendOtp();
                }}>
                <input
                  type="email"
                  value={this.state.email}
                  placeholder="Enter email"
                  className="form-input-field"
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                  required
                />
                <input
                  type="submit"
                  value="Send OTP"
                  onClick={(e) => {
                    //   e.preventDefault();
                  }}
                  className="form-input-button"
                />
              </form>
              <div className="forgot-password">
                <Link to="/login">
                  <u>Login Instead</u>
                </Link>
              </div>
            </div>
          ) : null}
          {this.state.step === 2 ? (
            <div className="login-form-main-div">
              <div className="login-logo"></div>
              <h3>Verify Email</h3>
              <h5 className="mb-4">Enter the otp sent to your email.</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.verifyEmail();
                }}>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  className="form-input-field"
                  onChange={(e) => {
                    this.setState({ otp: e.target.value });
                  }}
                  required
                />
                <input
                  type="submit"
                  value="Verify Email"
                  onClick={(e) => {
                    //   e.preventDefault();
                  }}
                  className="form-input-button"
                />
              </form>
              <div className="forgot-password d-flex justify-content-between">
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ step: 1 });
                  }}>
                  <u>Entered wrong email? Change email.</u>
                </a>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    this.sendOtp();
                  }}>
                  <u>Resend OTP</u>
                </a>
              </div>
            </div>
          ) : null}
          {this.state.step === 3 ? (
            <div className="login-form-main-div">
              <div className="login-logo"></div>
              <h3>Reset Password</h3>
              <h5 className="mb-4">Enter new password</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.resetPassword();
                }}>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="form-input-field"
                  onChange={(e) => {
                    this.setState({ newPassword: e.target.value });
                  }}
                  required
                />
                <input
                  type="password"
                  placeholder="Re-enter New Password"
                  className="form-input-field"
                  onChange={(e) => {
                    this.setState({ reEnter: e.target.value });
                  }}
                  required
                />
                <input
                  type="submit"
                  value="Update Password"
                  onClick={(e) => {
                    //   e.preventDefault();
                  }}
                  className="form-input-button"
                />
              </form>
              <div className="forgot-password">
                <Link to="/login">
                  <u>Login Instead</u>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(forgotPassword);
