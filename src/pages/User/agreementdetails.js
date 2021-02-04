import React, { PureComponent } from "react";
import { Divider, message } from "antd";
import apiCall from "../../utils/apiCall";

export default class Agreementdetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      document_no: "",
      issuing_authority: "",
      date_of_issue: "",
      date_of_expire: "",
      state: "",
      country: "",
      isApproved: false,
      changed: false,
    };
    this.submitInput = React.createRef();
    this.submitInput.current = "UPDATE";
    this.handleChange = this.handleChange.bind(this);
    this.submitAgreementDetails = this.submitAgreementDetails.bind(this);
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      changed: true,
      [name]: value,
    });
  };
  submitData = async () => {
    try {
      const {
        document_no,
        issuing_authority,
        date_of_issue,
        date_of_expire,
        state,
        country,
        isApproved,
      } = this.state;
      const data = {
        document_no,
        issuing_authority,
        date_of_issue,
        date_of_expire,
        state,
        country,
        isApproved,
      };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "agreementDetails",
        data,
      });
      const { status } = response.data;
      if (status) {
        message.success("Profile updated");
        this.refreshApi();
      }
    } catch (e) {
      console.log("Something went wrong");
      message.error("Please try again later.");
    }
  };
  validate = () => {
    const error = {
      isError: false,
      message: "",
    };

    for (let field of [
      "document_no",
      "issuing_authority",
      "date_of_issue",
      "date_of_expire",
      "state",
      "country",
    ]) {
      if (!this.state[field]) {
        error.message = "*All fiields are required*";
      }

      if (error.message.length > 0) error.isError = true;
    }
    return error;
  };

  submitAgreementDetails = (e) => {
    e.preventDefault();

    if (!this.state.changed) {
      message.warning("You haven't changed anything");
      return;
    }
    //validate the input disabled={isApproved ? true: false}
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
        const { agreementDetails } = response.data.data;
        await this.setState(() => {
          return agreementDetails;
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
          <Divider orientation="left">Agreement</Divider>
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="document_no"
                value={this.state.document_no}
                onChange={this.handleChange}
                type="text"
                placeholder="Document Number"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="issuing_authority"
                value={this.state.issuing_authority}
                onChange={this.handleChange}
                type="text"
                placeholder="Issuing Authority"
              />
            </div>
            <div className="col-md-6">
              <span className="field_information">Date of Issue</span>
              <input
                disabled={isApproved}
                name="date_of_issue"
                value={this.state.date_of_issue}
                onChange={this.handleChange}
                type="date"
                placeholder=""
              />
            </div>
            <div className="col-md-6">
              <span className="field_information">Date of Expiry</span>
              <input
                disabled={isApproved}
                name="date_of_expire"
                value={this.state.date_of_expire}
                onChange={this.handleChange}
                type="date"
                placeholder=""
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="state"
                value={this.state.state}
                onChange={this.handleChange}
                type="text"
                placeholder="State of Issue"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="country"
                value={this.state.country}
                onChange={this.handleChange}
                type="text"
                placeholder="Country of Issue"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <input
                onClick={this.submitAgreementDetails}
                style={
                  this.state.isApproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                disabled={isApproved}
                type="submit"
                className="form-button"
                value={this.state.isApproved ? "APPROVED" : "UPDATE"}
              />
            </div>
          </div>
        </form>
      </>
    );
  }
}
