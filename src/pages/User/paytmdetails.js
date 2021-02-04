import React, { PureComponent } from "react";
import { Divider, message } from "antd";
import apiCall from "../../utils/apiCall";
export default class Paytmdetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paytm_no: "",
      paytm_upi: "",
      isApproved: false,
      changed: false,
      errorMsg: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitPaytmDetails = this.submitPaytmDetails.bind(this);
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
      const { paytm_no, paytm_upi, isApproved } = this.state;
      const data = { paytm_no, paytm_upi, isApproved };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "paytmDetails",
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

    for (let field of ["paytm_no", "paytm_upi"]) {
      if (!this.state[field]) {
        error.message = "*All fiields are required*";
      }

      if (error.message.length > 0) error.isError = true;
    }
    return error;
  };

  submitPaytmDetails = (e) => {
    e.preventDefault();
    if (!this.state.changed) {
      message.warning("You haven't changed anything");
      return;
    }

    //validate the input
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
        const { paytmDetails } = response.data.data;
        await this.setState(() => {
          return paytmDetails;
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
          <Divider orientation="left">Paytm Details</Divider>
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="paytm_no"
                onChange={this.handleChange}
                value={this.state.paytm_no}
                type="text"
                placeholder="Paytm Number"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="paytm_upi"
                onChange={this.handleChange}
                value={this.state.paytm_upi}
                type="text"
                placeholder="Paytm UPI ID"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <input
                onClick={this.submitPaytmDetails}
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
