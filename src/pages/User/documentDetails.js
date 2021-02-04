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

// const intialState = {
//   docs: {},
//   entryData: {},
//   isApproved: false,
//   changed: true,
//   keyInput: "",
//   selectedURI: "",
//   selectedFieldName: "",
// };
export default class DocumentDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      docs: {},
      entryData: {},
      isApproved: false,
      changed: false,
      keyInput: "",
      uuris: {
        aadharURI: "",
        panURI: "",
        cancelled_chequeURI: "",
        trade_licenseURI: "",
        fsaai_licenseURI: "",
        business_panURI: "",
      },
      selectedURI: "",
      selectedFieldName: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  refreshAPi = async () => {
    try {
      let response = await apiCall.get("getProfile");
      const { userDocuments } = response.data.data;
      if (response.data.status) {
        console.log(userDocuments);
        this.setState({
          docs: userDocuments ? userDocuments : {},
        });
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  setthumbnail = async (files, fieldName) => {
    const { entryData } = this.state;
    let activeFile = {
      file: "",
      name: files[0].name,
      type: files[0].type,
      imagesrc: window.URL.createObjectURL(files[0]),
    };
    upload(files[0])
      .then(async (str) => {
        activeFile.file = str;
        entryData[`${fieldName}`] = activeFile;
        entryData[`is${fieldName}approved`] = false;
        this.setState({
          keyInput: fieldName,
          entryData,
          changed: true,
        });
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  handleSubmit = async (field) => {
    const { entryData, keyInput, uuris } = this.state;
    if (entryData[field]) {
      console.log(keyInput, entryData);
      let response = await apiCall.post("updateUserDocuments", {
        key: field,
        entryData: Object.assign(
          {},
          {
            [field]: entryData[field],
            [`is${field}approved`]: entryData[`is${field}approved`],
          }
        ),
      });
      if (response.data.status) {
        message.success("Docmuent Uploaded");
        uuris[`${field}URI`] = "";
        delete entryData[field];
        delete entryData[`is${field}approved`];
        await this.setState({
          docs: {},
          isApproved: false,
          changed: true,
          keyInput: "",
          selectedURI: "",
          selectedFieldName: "",
          uuris,
          entryData,
        });

        this.refreshAPi();
      } else {
        message.error(`${response.data.message}`);
      }
    } else {
      message.warning("You haven't upload anything");
    }
  };
  componentDidMount() {
    this.refreshAPi();
  }
  captureImage = async (base64) => {
    var { uuris, selectedFieldName, selectedURI, entryData } = this.state;
    let activeFile = {
      file: base64.split("base64,")[1],
      name:
        Date.now() +
        JSON.parse(localStorage.getItem("userDetails"))._id +
        ".png",
      type: "image/png",
      imagesrc: base64,
    };

    entryData[`${selectedFieldName}`] = activeFile;
    entryData[`is${selectedFieldName}approved`] = false;
    uuris[`${selectedURI}`] = base64;
    this.setState((_) => {
      return {
        entryData,
        changed: true,
        cameraModal: false,
        uuris,
        selectedFieldName: "",
        selectedURI: "",
      };
    });
  };
  render() {
    let {
      // aadharLink,
      isaadharapproved,
      // panLink,
      ispanapproved,
      // trade_licenseLink,
      istrade_licenseapproved,
      // cancelled_chequeLink,
      iscancelled_chequeapproved,
      // fsaai_licenseLink,
      isfsaai_licenseapproved,
      isbusiness_panapproved,
    } = this.state.docs;
    var { uuris } = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        <form className="custom-form">
          <Divider orientation="left">Documents</Divider>
          <div className="row">
            <div className="col-md-6">
              <span className="field_information">Aadhar Card</span>
              <input
                disabled={isaadharapproved}
                style={{ cursor: isaadharapproved ? "not-allowed" : "pointer" }}
                onChange={(e) => this.setthumbnail(e.target.files, "aadhar")}
                type="file"
                placeholder=""
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "aadharURI",
                    selectedFieldName: "aadhar",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.aadharURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img alt="" src={uuris.aadharURI} className="w-50 mb-3" />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  disabled={isaadharapproved}
                  style={{
                    cursor: isaadharapproved ? "not-allowed" : "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("aadhar");
                  }}
                  type="submit"
                  className="form-button"
                  value={isaadharapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
            </div>
            <div className="col-md-6">
              <span className="field_information">PAN Card</span>
              <input
                style={
                  ispanapproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                onChange={(e) => this.setthumbnail(e.target.files, "pan")}
                type="file"
                placeholder=""
                disabled={ispanapproved}
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "panURI",
                    selectedFieldName: "pan",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.panURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img alt="" src={uuris.panURI} className="w-50 mb-3" />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  style={
                    ispanapproved
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("pan");
                  }}
                  type="submit"
                  className="form-button"
                  value={ispanapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
            </div>
            <div className="col-md-6">
              <span className="field_information">Cancelled Cheque</span>
              <input
                style={
                  iscancelled_chequeapproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                onChange={(e) =>
                  this.setthumbnail(e.target.files, "cancelled_cheque")
                }
                type="file"
                disabled={iscancelled_chequeapproved}
                placeholder=""
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "cancelled_chequeURI",
                    selectedFieldName: "cancelled_cheque",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.cancelled_chequeURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img
                    alt=""
                    src={uuris.cancelled_chequeURI}
                    className="w-50 mb-3"
                  />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  style={
                    iscancelled_chequeapproved
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("cancelled_cheque");
                  }}
                  type="submit"
                  className="form-button"
                  value={iscancelled_chequeapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
            </div>
            <div className="col-md-6">
              <span className="field_information">Trade License</span>
              <input
                style={
                  istrade_licenseapproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                onChange={(e) =>
                  this.setthumbnail(e.target.files, "trade_license")
                }
                type="file"
                placeholder=""
                disabled={istrade_licenseapproved}
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "trade_licenseURI",
                    selectedFieldName: "trade_license",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.trade_licenseURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img
                    alt=""
                    src={uuris.trade_licenseURI}
                    className="w-50 mb-3"
                  />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  style={
                    istrade_licenseapproved
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("trade_license");
                  }}
                  type="submit"
                  className="form-button"
                  value={istrade_licenseapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
            </div>
            <div className="col-md-6">
              <span className="field_information">FSSAI License</span>
              <input
                style={
                  isfsaai_licenseapproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                disabled={isfsaai_licenseapproved}
                onChange={(e) =>
                  this.setthumbnail(e.target.files, "fsaai_license")
                }
                type="file"
                placeholder=""
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "fsaai_licenseURI",
                    selectedFieldName: "fsaai_license",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.fsaai_licenseURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img
                    alt=""
                    src={uuris.fsaai_licenseURI}
                    className="w-50 mb-3"
                  />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  style={
                    isfsaai_licenseapproved
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("fsaai_license");
                  }}
                  disabled={isfsaai_licenseapproved}
                  type="submit"
                  className="form-button"
                  value={isfsaai_licenseapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
            </div>
            <div className="col-md-6">
              <span className="field_information">Personal PAN</span>
              <input
                style={
                  isbusiness_panapproved
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
                disabled={isbusiness_panapproved}
                onChange={(e) =>
                  this.setthumbnail(e.target.files, "business_pan")
                }
                type="file"
                placeholder=""
              />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    cameraModal: true,
                    selectedURI: "business_panURI",
                    selectedFieldName: "business_pan",
                  });
                }}
                className="mb-3 d-block"
              >
                Or Capture Photo
              </a>
              {uuris.business_panURI !== "" ? (
                <React.Fragment>
                  <span className="field_information">Captured Image</span>
                  <img
                    alt=""
                    src={uuris.business_panURI}
                    className="w-50 mb-3"
                  />
                </React.Fragment>
              ) : null}
              <div className="col-md-12">
                <input
                  style={
                    isbusiness_panapproved
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSubmit("business_pan");
                  }}
                  disabled={isbusiness_panapproved}
                  type="submit"
                  className="form-button"
                  value={isbusiness_panapproved ? "APPROVED" : "UPDATE"}
                />
              </div>
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
                    }}
                  />
                </Spin>
              </div>
            </div>
          </Modal>
        </form>
      </React.Fragment>
    );
  }
}
