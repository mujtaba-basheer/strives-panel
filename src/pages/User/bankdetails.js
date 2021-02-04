import React, { PureComponent } from "react";
import { Divider, message } from "antd";
import apiCall from "../../utils/apiCall";

export default class Bankdetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      branch: "",
      address: "",
      city: "",
      zipcode: "",
      state: "",
      country: "",
      ifsc: "",
      account_no: "",
      isApproved: false,
      errorMsg: "",
      changed: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitBankDetails = this.submitBankDetails.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      changed: true,
      [name]: value,
    });
  };
  validate = () => {
    const error = {
      isError: false,
      message: "",
    };

    for (let field of [
      "name",
      "branch",
      "address",
      "city",
      "zipcode",
      "state",
      "country",
      "ifsc",
      "account_no",
    ]) {
      if (!this.state[field]) {
        error.message = "*All fiields are required*";
      }

      if (error.message.length > 0) error.isError = true;
    }
    return error;
  };

  submitData = async () => {
    try {
      const {
        name,
        branch,
        address,
        city,
        zipcode,
        state,
        country,
        ifsc,
        account_no,
        isApproved,
      } = this.state;
      const data = {
        name,
        branch,
        address,
        city,
        zipcode,
        state,
        country,
        ifsc,
        account_no,
        isApproved,
      };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "bankDetails",
        data,
      });
      const { status } = response.data;
      if (status) {
        message.success("Profile updated");
        this.refreshApi();
      }
    } catch (e) {
      console.log("something went wrong");
      this.setState({
        errorMsg: "Please try again, after few seconds",
      });
    }
  };

  submitBankDetails = (e) => {
    e.preventDefault();

    if (!this.state.changed) {
      message.warning("you haven't change anything");
      return;
    }
    //validate the input disabled={isApproved}
    const err = this.validate();
    if (err.isError) {
      this.setState({
        errorMsg: err.message,
      });
      return;
    }
    //call the api
    this.submitData();
  };
  refreshApi = async () => {
    try {
      const response = await apiCall.get("getProfile");
      const { status } = response.data;
      if (status) {
        const { bankDetails } = response.data.data;
        await this.setState(() => {
          return bankDetails;
        });
      }
    } catch (e) {
      console.log("Something Went Wrong.");
      message.error("Please Try to refresh the page.");
    }
  };
  async componentDidMount() {
    this.refreshApi();
  }
  render() {
    const { isApproved } = this.state;
    return (
      <>
        <form className="custom-form">
          <Divider orientation="left">Bank Details</Divider>
          <div className="row">
            <div className="col-md-12">
              <p>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="branch"
                value={this.state.branch}
                onChange={this.handleChange}
                type="text"
                placeholder="Branch"
              />
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
                type="text"
                placeholder="Address Line 1"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="city"
                value={this.state.city}
                onChange={this.handleChange}
                type="text"
                placeholder="City"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="zipcode"
                value={this.state.zipcode}
                onChange={this.handleChange}
                type="text"
                placeholder="ZIP / Postal Code"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="state"
                value={this.state.state}
                onChange={this.handleChange}
                type="text"
                placeholder="State"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="country"
                value={this.state.country}
                onChange={this.handleChange}
                type="text"
                placeholder="Country"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="ifsc"
                value={this.state.ifsc}
                onChange={this.handleChange}
                type="text"
                placeholder="IFSC"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="account_no"
                value={this.state.account_no}
                onChange={this.handleChange}
                type="text"
                placeholder="ACCOUNT NO."
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <input
                onClick={this.submitBankDetails}
                style={
                  isApproved ? { cursor: "not-allowed" } : { cursor: "pointer" }
                }
                disabled={isApproved}
                type="submit"
                className="form-button"
                value={isApproved ? "APPROVED" : "UPDATE"}
              />
            </div>
          </div>
        </form>
      </>
    );
  }
}
