/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from "react";
import { Divider, message, Modal, Spin } from "antd";
import apiCall from "../../utils/apiCall";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

const upload = (file) =>
  new Promise((resolve) => {
    var fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onloadend = function (event) {
      var img = {};
      img.src = event.target.result;
      console.log(img);
      resolve(img.src.split("base64,")[1]);
      // image2base64(img.src) // you can also to use url
      //   .then((response) => {
      //     console.log(response);
      //     resolve(response);
      //   });
      // .catch((error) => {
      //   console.log(error); //Exepection error....
      // });
    };
  });
export default class Personaldetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dob: "",
      doa: "",
      aadharno: "",
      panno: "",
      relation: "Please Select",
      relation_name: "",
      building_name: "",
      building_no: "",
      flat_no: "",
      street: "",
      country: "",
      state: "",
      city: "",
      zipcode: "",
      isApproved: false,
      errorMsg: "",
      changed: false,
      photo: "https://image.flaticon.com/icons/svg/848/848006.svg",
      cameraModal: false,
      cameraLoading: true,
      dataUri: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitPersonalDetails = this.submitPersonalDetails.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      changed: true,
      [name]: value,
    });
  };
  setthumbnail = (files) => {
    console.log(files);
    var { photo } = this.state;
    let activeFile = {
      file: "",
      name: files[0].name,
      type: files[0].type,
      imagesrc: window.URL.createObjectURL(files[0]),
    };
    console.log(activeFile);
    upload(files[0]).then((str) => {
      activeFile.file = str;
      photo = activeFile;
      this.setState({ photo, changed: true, dataUri: "" });
    });
  };
  submitdata = async () => {
    try {
      const {
        name,
        dob,
        doa,
        aadharno,
        panno,
        relation,
        relation_name,
        building_name,
        building_no,
        flat_no,
        street,
        country,
        state,
        city,
        zipcode,
        isApproved,
        photo,
      } = this.state;
      const data = {
        name,
        dob,
        doa,
        aadharno,
        panno,
        relation,
        relation_name,
        building_name,
        building_no,
        flat_no,
        street,
        country,
        state,
        city,
        zipcode,
        isApproved,
        photo,
      };
      const response = await apiCall.post("updateUserDetails", {
        fieldName: "personalDetails",
        data,
      });
      const { status } = response.data;
      if (status) {
        message.success("Profile updated");
        this.refreshApi();
      }
    } catch (e) {
      console.log("Something Went Wrong.");
      message.error("Please try again later.");
    }
  };
  submitPersonalDetails = async (e) => {
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
    this.submitdata();
  };
  validate = () => {
    const error = {
      isError: false,
      message: "",
    };
    if (this.state.relation === "Please Select") {
      error.message = "*Please select the valid 'Relation Field'*";
    }

    for (let field of [
      "name",
      "dob",
      "doa",
      "aadharno",
      "panno",
      "relation_name",
      "building_name",
      "building_no",
      "flat_no",
      "street",
      "country",
      "state",
      "city",
      "zipcode",
    ]) {
      if (!this.state[field]) {
        error.message = "*All fiields are required*";
      }

      if (error.message.length > 0) error.isError = true;
    }
    return error;
  };
  refreshApi = async () => {
    try {
      const response = await apiCall.get("getProfile");
      const { status } = response.data;
      if (status) {
        const { personalDetails } = response.data.data;
        await this.setState(() => {
          return personalDetails;
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
  captureImage = async (base64) => {
    this.setState({ dataUri: base64 });
    var { photo } = this.state;
    let activeFile = {
      file: base64.split("base64,")[1],
      name:
        Date.now() +
        JSON.parse(localStorage.getItem("userDetails"))._id +
        ".png",
      type: "image/png",
      imagesrc: base64,
    };
    photo = activeFile;
    this.setState((_) => {
      return {
        photo,
        changed: true,
        cameraModal: false,
      };
    });
  };
  render() {
    const { isApproved, photo } = this.state;
    return (
      <>
        <form onSubmit={this.submitPersonalDetails} className="custom-form">
          <Divider orientation="left">Personal Details</Divider>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex single-review-form-col">
                <div className="review-form-header">Profile Photo</div>
                <div
                  className="review-form-data position-relative cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={photo.file ? photo.imagesrc : photo}
                    alt=""
                    style={{
                      width: "120px",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <input
                    type="file"
                    onChange={(e) => this.setthumbnail(e.target.files)}
                    style={{
                      position: "absolute",
                      left: 0,
                      padding: 0,
                      height: "120px",
                      opacity: 0,
                    }}
                  />
                </div>
              </div>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ cameraModal: true });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
            </div>
            <div className="col-md-12">
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
            <div className="col-md-12">
              <span className="field_information"></span>
              <input
                disabled={isApproved}
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="col-md-6">
              <span className="field_information">DOB</span>
              <input
                disabled={isApproved}
                name="dob"
                onChange={this.handleChange}
                value={this.state.dob}
                type="date"
                placeholder="DOB"
              />
            </div>
            <div className="col-md-6">
              <span className="field_information">DOA</span>
              <input
                disabled={isApproved}
                name="doa"
                onChange={this.handleChange}
                value={this.state.doa}
                type="date"
                placeholder="DOA"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="aadharno"
                onChange={this.handleChange}
                value={this.state.aadharno}
                type="number"
                maxLength={12}
                minLength={12}
                placeholder="Aadhar Number"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="panno"
                onChange={this.handleChange}
                value={this.state.panno}
                type="text"
                placeholder="PAN Number"
              />
            </div>
            <div className="col-md-5">
              <select
                name="relation"
                disabled={isApproved}
                onChange={this.handleChange}
              >
                <option value="Please Select">{this.state.relation}</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Children">Children</option>
              </select>
            </div>
            <div className="col-md-7">
              <input
                disabled={isApproved}
                name="relation_name"
                onChange={this.handleChange}
                value={this.state.relation_name}
                type="text"
                placeholder="Enter Name of Relation"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="building_name"
                onChange={this.handleChange}
                value={this.state.building_name}
                type="text"
                placeholder="Building Name"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="building_no"
                onChange={this.handleChange}
                value={this.state.building_no}
                type="text"
                placeholder="Building No."
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="flat_no"
                onChange={this.handleChange}
                value={this.state.flat_no}
                type="text"
                placeholder="Flat No."
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="street"
                onChange={this.handleChange}
                value={this.state.street}
                type="text"
                placeholder="Street Name"
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
                name="country"
                onChange={this.handleChange}
                value={this.state.country}
                type="text"
                placeholder="Country"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="state"
                onChange={this.handleChange}
                value={this.state.state}
                type="text"
                placeholder="State"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="city"
                onChange={this.handleChange}
                value={this.state.city}
                type="text"
                placeholder="City"
              />
            </div>
            <div className="col-md-6">
              <input
                disabled={isApproved}
                name="zipcode"
                onChange={this.handleChange}
                value={this.state.zipcode}
                type="text"
                placeholder="ZIP / Postal Code"
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
                type="submit"
                className="form-button"
                value={isApproved ? "APPROVED" : "UPDATE"}
              />
            </div>
          </div>
          <Modal
            title="Edit"
            visible={this.state.cameraModal}
            onCancel={(e) => {
              this.setState({ cameraModal: false });
            }}
            footer={null}
            style={{ width: "100%!important", maxWidth: "700px" }}
            className="w-100"
          >
            <div className="row">
              <div className="col-md-12">
                <Spin spinning={this.state.cameraLoading}>
                  <Camera
                    onCameraStart={(e) => {
                      this.setState({ cameraLoading: false });
                    }}
                    onTakePhoto={(dataUri) => {
                      this.captureImage(dataUri);
                      console.log(dataUri);
                    }}
                  />
                </Spin>
              </div>
            </div>
          </Modal>
        </form>
      </>
    );
  }
}
