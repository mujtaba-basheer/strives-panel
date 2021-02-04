/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, PageHeader, message, Spin, Modal } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

const { Header, Content, Footer } = Layout;
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
export default class higherprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: {
        password: "",
        newPassword: "",
        reEnterPassword: "",
      },
      changed: false,
      newData: { photo: "" },
      cameraModal: false,
      cameraLoading: true,
      dataUri: "",
    };
  }
  refreshAPi = async () => {
    let response = await apiCall.get("getProfile");
    if (response.data.status) {
      this.setState({
        newData: response.data.data,
        changed: false,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  componentDidMount = async () => {
    this.refreshAPi();
  };
  setthumbnail = (files) => {
    console.log(files);
    var { newData } = this.state;
    let activeFile = {
      file: "",
      name: files[0].name,
      type: files[0].type,
      imagesrc: window.URL.createObjectURL(files[0]),
    };
    console.log(activeFile);
    upload(files[0]).then((str) => {
      activeFile.file = str;
      newData.photo = activeFile;
      this.setState({ newData, changed: true, dataUri: "" });
    });
  };
  updatePassword = async () => {
    var { newPassword } = this.state;
    if (
      newPassword.newPassword.length === 0 ||
      newPassword.reEnterPassword.length === 0 ||
      newPassword.password.length === 0
    ) {
      message.error("Please Enter All Fields");
    } else {
      if (newPassword.newPassword === newPassword.reEnterPassword) {
        let response = await apiCall.post("updatePassword", newPassword);
        if (response.data.status) {
          message.success("Password Resetted");
          this.setState({
            newPassword: {
              password: "",
              newPassword: "",
              reEnterPassword: "",
            },
          });
        } else {
          message.error(`${response.data.message}`);
        }
      } else {
        message.error("New Passwords Don't Match");
      }
    }
  };
  updateProfile = async () => {
    var { newData } = this.state;
    if (this.state.changed) {
      delete newData._id;
      let response = await apiCall.post("updateHigherProfile", newData);
      if (response.data.status) {
        message.success("Profile Updated");
        this.refreshAPi();
      } else {
        message.error(`${response.data.message}`);
      }
    } else {
      message.warning("You haven't changed anything");
    }
  };
  captureImage = async (base64) => {
    this.setState({ dataUri: base64 });
    var { newData } = this.state;
    let activeFile = {
      file: base64.split("base64,")[1],
      name: Date.now() + JSON.parse(localStorage.getItem("userDetails"))._id + ".png",
      type: "image/png",
      imagesrc: base64,
    };
    newData.photo = activeFile;
    this.setState((_) => {
      return {
        newData,
        changed: true,
        cameraModal: false,
      };
    });
  };
  render() {
    var { newData, newPassword } = this.state;
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"8"} />
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Header
              className="site-layout-background"
              style={{
                padding: 0,
                position: "fixed",
                zIndex: "9",
                width: "100%",
              }}>
              <img
                alt=""
                src="/menu.png"
                style={{ cursor: "pointer", width: "20px", marginLeft: "20px" }}
                onClick={(e) => {
                  document.body.classList.toggle("isClosed");
                }}
              />
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div className="site-layout-background" style={{ padding: 24, textAlign: "center" }}>
                <div className="main-content">
                  <PageHeader className="site-page-header" onBack={null} title="Edit Profile" subTitle="" />
                  <form className="custom-form">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex single-review-form-col">
                          <div className="review-form-header">Profile Photo</div>
                          <div
                            className="review-form-data position-relative cursor-pointer"
                            style={{ cursor: "pointer" }}>
                            <img
                              alt=""
                              src={newData.photo.file ? newData.photo.imagesrc : newData.photo}
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
                          className="mb-3 d-block mb-3">
                          Or Capture Photo
                        </a>
                      </div>
                      <div className="col-md-6">
                        <span className="field_information"></span>
                        <input
                          onChange={(e) => {
                            newData.name = e.target.value;
                            this.setState({ newData, changed: true });
                          }}
                          value={newData.name}
                          type="text"
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <span className="field_information">DOB</span>
                        <input
                          onChange={(e) => {
                            newData.dob = e.target.value;
                            this.setState({ newData, changed: true });
                          }}
                          value={newData.dob ? newData.dob : "DOB"}
                          type="date"
                          placeholder="DOB"
                        />
                      </div>
                      <div className="col-md-6">
                        <input value={newData.email} readOnly type="email" placeholder="Email" />
                      </div>
                      <div className="col-md-6">
                        <input
                          onChange={(e) => {
                            newData.phone = e.target.value;
                            this.setState({ newData, changed: true });
                          }}
                          value={newData.phone ? newData.phone : "Phone Number"}
                          type="number"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          onClick={(e) => {
                            e.preventDefault();
                            this.updateProfile();
                          }}
                          type="submit"
                          className="form-button"
                          value="UPDATE PROFILE"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="main-content">
                  <PageHeader className="site-page-header" onBack={null} title="Edit Password" subTitle="" />
                  <form className="custom-form">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          value={newPassword.password}
                          onChange={(e) => {
                            newPassword.password = e.target.value;
                            this.setState({ newPassword });
                          }}
                          type="password"
                          placeholder="Current Password"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          value={newPassword.newPassword}
                          onChange={(e) => {
                            newPassword.newPassword = e.target.value;
                            this.setState({ newPassword });
                          }}
                          type="password"
                          placeholder="New Password"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          value={newPassword.reEnterPassword}
                          onChange={(e) => {
                            newPassword.reEnterPassword = e.target.value;
                            this.setState({ newPassword });
                          }}
                          type="password"
                          placeholder="Confirm New Password"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          onClick={(e) => {
                            e.preventDefault();
                            this.updatePassword();
                          }}
                          type="submit"
                          className="form-button"
                          value="UPDATE PASSWORD"
                        />
                      </div>
                    </div>
                  </form>
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
                className="w-100">
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
            </Content>
            <Footer style={{ textAlign: "center" }}>Created by amarnathmodi ©2020</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
