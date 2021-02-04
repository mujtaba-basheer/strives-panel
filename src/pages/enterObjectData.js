/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import Notification from "../common/notifi";
import { Layout, PageHeader, message, Alert, Modal, Spin } from "antd";
import apiCall from "../utils/apiCall";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "antd/dist/antd.css";
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

export default class enterObjectData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectList: [],
      keysForObject: [],
      entryData: {},
      inputKeyData: {},
      cameraModal: false,
      cameraLoading: true,
      dataUri: "",
      objectTypeList: [],
      companyList: [],
    };
  }
  getData = async () => {
    let res1 = apiCall.get("getObjectsForUser");
    let res2 = apiCall.get("getComapnyList");

    const response = await Promise.all([res1, res2]);
    if (response[0].data.status) {
      this.setState({
        objectList: response[0].data.data[0].objectAssigned,
        objectTypeList: response[0].data.data[0].objectType,
      });
    } else {
      message.error(`${response[0].data.message}`);
    }
    if (response[1].data.status) {
      console.log(response[1].data.data);
      this.setState({
        companyList: response[1].data.data,
      });
    } else {
      message.error(`${response[1].data.message}`);
    }
  };
  setFields = async (id) => {
    var { objectList, entryData, objectTypeList } = this.state;
    var objIndex = objectList.findIndex((x) => x._id === id);
    let response = await apiCall.post("getFieldsForObject", {
      fields: objectList[objIndex].fields,
    });
    if (response.data.status) {
      entryData = {};
      entryData.id = id;
      entryData.requiresApproval =
        objectTypeList.findIndex(
          (x) => x._id === objectList[objIndex].objectTypeId
        ) > -1
          ? objectTypeList[
              objectTypeList.findIndex(
                (x) => x._id === objectList[objIndex].objectTypeId
              )
            ].approval
          : false;
      entryData.objectName = objectList[objIndex].title;
      this.setState({ keysForObject: response.data.data, entryData });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  setthumbnail = (files) => {
    console.log(files);
    let activeFile = {
      file: "",
      name: files[0].name,
      type: files[0].type,
      imagesrc: window.URL.createObjectURL(files[0]),
    };
    console.log(activeFile);
    const { entryData } = this.state;
    upload(files[0])
      .then((str) => {
        activeFile.file = str;
        entryData.photo = activeFile;
        this.setState((_) => {
          return {
            entryData,
            changed: true,
            dataUri: "",
          };
        });
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  checkEmptyInputs = () => {
    const error = {
      isError: false,
      message: "",
    };

    const keysArray = this.state.keysForObject.map((key) => key["title"]);
    for (let name of keysArray) {
      if (!this.state.inputKeyData[name]) {
        error.message = "Please select all the fields";
      }
    }

    if (error.message.length > 0) error.isError = true;

    return error;
  };

  submitDataforObjects = async () => {
    let { inputKeyData, entryData } = this.state;
    const temp = [];
    const keysArray = this.state.keysForObject.map((key) => key["title"]);
    for (let key of keysArray) {
      const obj = {};
      obj[`${key}`] = inputKeyData[key];
      temp.push(obj);
    }

    entryData.data = temp;
    entryData.objectId = entryData.id;
    delete entryData.id;
    await this.setState({
      entryData,
    });

    const err = this.checkEmptyInputs();
    if (err.isError || !this.state.changed) {
      message.error(err.message);
      return;
    }

    try {
      const response = await apiCall.post("updateDataForObjects", {
        data: entryData,
      });
      if (response.data.status) {
        message.success("Object Data Uploaded");
        this.setState({ keysForObject: [], entryData: {}, inputKeyData: {} });
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  componentDidMount = () => {
    this.getData();
  };
  captureImage = async (base64) => {
    this.setState({ dataUri: base64 });
    const { entryData } = this.state;
    let activeFile = {
      file: base64.split("base64,")[1],
      name:
        Date.now() +
        JSON.parse(localStorage.getItem("userDetails"))._id +
        ".png",
      type: "image/png",
    };
    entryData.photo = activeFile;
    this.setState((_) => {
      return {
        entryData,
        changed: true,
        cameraModal: false,
      };
    });
  };
  render() {
    var {
      objectList,
      keysForObject,
      entryData,
      inputKeyData,
      companyList,
    } = this.state;
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"11"} />
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Header
              className="site-layout-background"
              style={{
                padding: 0,
                position: "fixed",
                zIndex: "9",
                width: "100%",
              }}
            >
              <img
                src="/menu.png"
                alt=""
                style={{ cursor: "pointer", width: "20px", marginLeft: "20px" }}
                onClick={(e) => {
                  document.body.classList.toggle("isClosed");
                }}
              />
              <div
                style={{
                  display: "inline-block",
                  width: "calc(100% - 40px)",
                  textAlign: "right",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "red",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                  }}
                />{" "}
                <img
                  src="/bell.png"
                  alt=""
                  onClick={(e) => {
                    document.body.classList.toggle("notifOpen");
                  }}
                  style={{
                    cursor: "pointer",
                    width: "20px",
                    marginRight: "20px",
                  }}
                />
              </div>
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, textAlign: "center" }}
              >
                <div className="main-content">
                  <PageHeader
                    className="site-page-header"
                    onBack={null}
                    title="Enter Data"
                    subTitle=""
                  />
                  <form className="custom-form">
                    <div className="row">
                      <div className="col-md-6">
                        <select
                          onChange={(e) => {
                            this.setFields(e.target.value);
                          }}
                        >
                          <option disabled selected>
                            Please Select Object
                          </option>
                          {objectList.map((item) => {
                            return (
                              <option value={item._id}>{item.title}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </form>
                  {this.state.keysForObject.length > 0 ? (
                    <React.Fragment>
                      <form className="custom-form">
                        <div className="row">
                          <div className="col-md-6">
                            <span className="field_information">Picture</span>

                            <input
                              onChange={(e) => {
                                this.setthumbnail(e.target.files);
                              }}
                              type="file"
                              placeholder="Date"
                              required
                            />
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
                            {this.state.dataUri !== "" ? (
                              <React.Fragment>
                                <span className="field_information">
                                  Captured Image
                                </span>
                                <img
                                  alt=""
                                  src={this.state.dataUri}
                                  className="w-100 mb-3"
                                />
                              </React.Fragment>
                            ) : null}
                          </div>
                          <div className="col-md-6">
                            <span className="field_information">Date</span>
                            <input
                              onChange={(e) => {
                                entryData.date = e.target.value;
                                this.setState({ entryData, changed: true });
                              }}
                              type="date"
                              placeholder="Date"
                              required
                            />
                          </div>
                          {keysForObject.map((item, index) => {
                            return (
                              <div className="col-md-6">
                                <span className="field_information">
                                  {item.title}
                                </span>
                                {item.title === "Party Name" ? (
                                  <select
                                    onChange={(e) => {
                                      inputKeyData[item.title] = e.target.value;
                                      this.setState({
                                        inputKeyData,
                                      });
                                    }}
                                  >
                                    <option disabled selected>
                                      Please Select Party
                                    </option>
                                    {companyList.map((item) => {
                                      return (
                                        <option
                                          key={item._id}
                                          value={item.name}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                ) : (
                                  <input
                                    onChange={(e) => {
                                      inputKeyData[item.title] = e.target.value;
                                      this.setState({
                                        inputKeyData,
                                      });
                                    }}
                                    type={
                                      item.type === "Numeric"
                                        ? "number"
                                        : item.type === "Date"
                                        ? "date"
                                        : item.type === "Time"
                                        ? "time"
                                        : "text"
                                    }
                                    placeholder={item.title}
                                    required
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                  isDataAdded: true,
                                });
                                this.submitDataforObjects();
                              }}
                              type="submit"
                              className="form-button"
                              value="ADD DATA FOR OBJECT"
                            />
                          </div>
                        </div>
                      </form>
                    </React.Fragment>
                  ) : (
                    <Alert
                      message="Please Select Object"
                      type="warning"
                      showIcon
                    />
                  )}
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
            </Content>
            <Notification />
            <Footer style={{ textAlign: "center" }}>
              Created by amarnathmodi ©2020
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
