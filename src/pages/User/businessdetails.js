import React, { PureComponent } from "react";
import { Divider, message } from "antd";
import apiCall from "../../utils/apiCall";

export default class Businessdetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firm: "",
      type: "",
      office_address: "",
      building_name: "",
      building_no: "",
      street: "",
      village: "",
      town: "",
      city: "",
      police_station: "",
      police_office: "",
      district: "",
      state: "",
      country: "",
      isApproved: false,
      errorMsg: "",
      changed: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitBusinessDetails = this.submitBusinessDetails.bind(this);
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
      "firm",
      "type",
      "office_address",
      "village",
      "town",
      "building_name",
      "building_no",
      "street",
      "country",
      "state",
      "city",
      "district",
      "police_office",
      "police_station",
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
        firm,
        type,
        office_address,
        building_name,
        building_no,
        street,
        village,
        town,
        city,
        police_station,
        police_office,
        district,
        state,
        country,
        isApproved,
      } = this.state;
      const data = {
        firm,
        type,
        office_address,
        building_name,
        building_no,
        street,
        village,
        town,
        city,
        police_station,
        police_office,
        district,
        state,
        country,
        isApproved,
      };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "businessDetails",
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

  submitBusinessDetails = (e) => {
    e.preventDefault();
    if (!this.state.changed) {
      message.warning("You haven't change anything");
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
      const { companyAssigned } = response.data.data;
      const response1 = await apiCall.get(`getCompany/${companyAssigned}`);
      const status1 = response1.data.status;
      if (status && status1) {
        const { businessDetails } = response.data.data;
        this.setState({
          businessDetails,
          firm: response1.data.data.name,
        });
        // await this.setState(() => {
        //     return businessDetails;
        // });
      }
    } catch (e) {
      console.log("Something Went Wrong.");
      message.error("Please Try to refresh the page.");
    }
  };

  async componentDidMount() {
    this.refreshApi();
    // let res = await apiCall.get();
  }
  render() {
    const { isApproved } = this.state;
    return (
      <>
        <form className="custom-form">
          <Divider orientation="left">Business Details</Divider>
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="firm"
                value={this.state.firm}
                onChange={(e) => {
                  e.preventDefault();
                  message.error("Read Only Field.");
                }}
                type="text"
                placeholder="Firm"
              />
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="type"
                value={this.state.type}
                onChange={this.handleChange}
                type="text"
                placeholder="Type"
              />
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="office_address"
                value={this.state.office_address}
                onChange={this.handleChange}
                type="text"
                placeholder="Office Address"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="building_name"
                value={this.state.building_name}
                onChange={this.handleChange}
                type="text"
                placeholder="Building Name"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="building_no"
                value={this.state.building_no}
                onChange={this.handleChange}
                type="text"
                placeholder="Building Number"
              />
            </div>
            <div className="col-md-12">
              <input
                disabled={isApproved}
                name="street"
                value={this.state.street}
                onChange={this.handleChange}
                type="text"
                placeholder="Street"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="village"
                value={this.state.village}
                onChange={this.handleChange}
                type="text"
                placeholder="Village"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="town"
                value={this.state.town}
                onChange={this.handleChange}
                type="text"
                placeholder="Town"
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
                name="police_station"
                value={this.state.police_station}
                onChange={this.handleChange}
                type="text"
                placeholder="Police Station"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="police_office"
                value={this.state.police_office}
                onChange={this.handleChange}
                type="text"
                placeholder="Police Office"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="district"
                value={this.state.district}
                onChange={this.handleChange}
                type="text"
                placeholder="District"
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
          </div>

          <div className="row">
            <div className="col-md-12">
              <input
                style={
                  isApproved ? { cursor: "not-allowed" } : { cursor: "pointer" }
                }
                disabled={isApproved}
                onClick={this.submitBusinessDetails}
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
