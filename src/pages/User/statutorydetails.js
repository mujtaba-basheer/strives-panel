import React, { PureComponent } from "react";
import { Divider, message } from "antd";
import apiCall from "../../utils/apiCall";

export default class Statutorydetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gstin: "",
      pan: "",
      trade_license: "",
      fsaai_license: "",
      isApproved: false,
      errorMsg: "",
      changed: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitStatutoryDetails = this.submitStatutoryDetails.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      changed: true,
      [name]: value,
    });
  };
  submitdata = async () => {
    try {
      const {
        gstin,
        pan,
        fsaai_license,
        trade_license,
        isApproved,
      } = this.state;
      const data = { gstin, pan, fsaai_license, trade_license, isApproved };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "statutoryDetails",
        data,
      });
      const { status } = response.data;
      if (status) {
        message.success("Profile UPdated");
        this.refreshApi();
      }
    } catch (e) {
      console.log("Something Went Wrong.");
      message.error("Please try again later.");
    }
  };
  validate = () => {
    const error = {
      isError: false,
      message: "",
    };

    for (let field of ["gstin", "pan", "trade_license", "fsaai_license"]) {
      if (!this.state[field]) {
        error.message = "*All fiields are required*";
      }

      if (error.message.length > 0) error.isError = true;
    }
    return error;
  };
  submitStatutoryDetails = (e) => {
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
    this.submitdata();
  };

  refreshApi = async () => {
    try {
      const response = await apiCall.get("getProfile");
      const { status } = response.data;
      if (status) {
        const { statutoryDetails } = response.data.data;
        await this.setState(() => {
          return statutoryDetails;
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
          <Divider orientation="left">Statutory Details</Divider>
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                onChange={this.handleChange}
                name="gstin"
                value={this.state.gstin}
                type="text"
                placeholder="GSTIN"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                onChange={this.handleChange}
                name="pan"
                value={this.state.pan}
                type="text"
                placeholder="PAN"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                onChange={this.handleChange}
                name="trade_license"
                value={this.state.trade_license}
                type="text"
                placeholder="TRADE LICENSE"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                onChange={this.handleChange}
                name="fsaai_license"
                value={this.state.fsaai_license}
                type="text"
                placeholder="FSAAI LICENSE"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <input
                onClick={this.submitStatutoryDetails}
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
