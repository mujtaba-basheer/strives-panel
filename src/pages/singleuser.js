import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, PageHeader, Divider, Collapse, message } from "antd";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import Viewer from "@phuocng/react-pdf-viewer";

import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";
import apiCall from "../utils/apiCall";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;

class singleuser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personalDetails: {},
      businessDetails: {},
      bankDetails: {},
      statutoryDetails: {},
      agreementDetails: {},
      paytmDetails: {},
      userDocuments: {},
      isDetails: false,
      allData: {},
    };

    this.approveUserData = this.approveUserData.bind(this);
    this.verifyDocs = this.verifyDocs.bind(this);
  }

  giveApproval = (name) => {
    const {
      personalDetails,
      businessDetails,
      bankDetails,
      statutoryDetails,
      paytmDetails,
      agreementDetails,
    } = this.state;
    switch (name) {
      case "personalDetails":
        return !personalDetails.isApproved;
      case "bankDetails":
        return !bankDetails.isApproved;
      case "businessDetails":
        return !businessDetails.isApproved;
      case "statutoryDetails":
        return !statutoryDetails.isApproved;
      case "paytmDetails":
        return !paytmDetails.isApproved;
      case "agreementDetails":
        return !agreementDetails.isApproved;
      default:
        return;
    }
  };
  verifyDocs = (input) => async (e) => {
    e.preventDefault();
    const { userDocuments } = this.state;
    const {
      match: { params },
    } = this.props;
    try {
      const response = await apiCall.post("verifyUserDocuments", {
        key: input,
        id: params.userId,
        approval: !userDocuments[`is${input}approved`],
      });
      if (response.status) {
        message.success("Status Updated");
        this.refreshApi();
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  approveUserData = (fieldName) => async (e) => {
    e.preventDefault();
    console.log(this.props.match.params.userId);
    const approval = this.giveApproval(fieldName);
    // call the api to verify data
    try {
      const response = await apiCall.post(`verifyUserData/${this.props.match.params.userId}`, { fieldName, approval });
      if (response.data.status) {
        console.log("user data verified.");
        await this.refreshApi();
        message.success(`${approval ? "Approved" : "Unapproved"}`);

        // window.location.reload();
      }
    } catch (e) {
      console.log("something went wrong", e.message);
      message.error("Please try again later.");
    }
  };

  refreshApi = async () => {
    const {
      match: { params },
    } = this.props;
    console.log(params);
    try {
      const response = await apiCall.get(`/getUserProfile/${params.userId}`);

      const { status, data } = response.data;
      const { isDetails } = data;
      await this.setState({ isDetails, allData: response.data.data });
      if (status && isDetails) {
        const {
          personalDetails,
          businessDetails,
          bankDetails,
          statutoryDetails,
          agreementDetails,
          paytmDetails,
          userDocuments,
        } = data;
        await this.setState({
          personalDetails,
          businessDetails,
          bankDetails,
          statutoryDetails,
          agreementDetails,
          paytmDetails,
          userDocuments,
          allData: response.data.data,
        });
      }
    } catch (e) {
      console.log("Something went wrong", e.message);
      message.error("Please try again later.");
    }
  };
  async componentDidMount() {
    this.refreshApi();
  }
  render() {
    var {
      personalDetails,
      businessDetails,
      bankDetails,
      statutoryDetails,
      paytmDetails,
      agreementDetails,
      userDocuments,
      allData,
    } = this.state;
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"100"} />
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
                  <PageHeader className="site-page-header" onBack={null} title={"Manage " + allData.name} subTitle="" />
                  <Collapse defaultActiveKey={["1"]}>
                    <Panel header="Personal Details" key="1">
                      {personalDetails ? (
                        <form className="custom-form">
                          <Divider orientation="left">Personal Details</Divider>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="d-flex single-review-form-col">
                                <div className="review-form-header">Profile Photo</div>
                                <div
                                  className="review-form-data position-relative cursor-pointer"
                                  style={{ cursor: "pointer" }}>
                                  <img
                                    alt=""
                                    src={personalDetails.photo ? personalDetails.photo : ""}
                                    style={{
                                      width: "120px",
                                      height: "auto",
                                      objectFit: "contain",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Name</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.name ? personalDetails.name : ""}
                                type="text"
                                placeholder="Name"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">DOB</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.dob ? personalDetails.dob : ""}
                                type="date"
                                placeholder="DOB"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">DOA</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.doa ? personalDetails.doa : ""}
                                type="date"
                                placeholder="DOA"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Aadhar Number</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.aadharno ? personalDetails.aadharno : ""}
                                type="text"
                                placeholder="Aadhar Number"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Pan Number</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.panno ? personalDetails.panno : ""}
                                type="text"
                                placeholder="PAN Number"
                              />
                            </div>
                            <div className="col-md-5">
                              <span className="field_information">Relation</span>
                              <select readOnly disabled>
                                <option selected disabled>
                                  {personalDetails.relation ? personalDetails.relation : ""}
                                </option>
                              </select>
                            </div>
                            <div className="col-md-7">
                              <span className="field_information">Name</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.relation_name ? personalDetails.relation_name : ""}
                                type="text"
                                placeholder="Enter Name of Relation"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Building Name</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.building_name ? personalDetails.building_name : ""}
                                type="text"
                                placeholder="Building Name"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Building No</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.building_no ? personalDetails.building_no : ""}
                                type="text"
                                placeholder="Building No."
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Flat No</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.flat_no ? personalDetails.flat_no : ""}
                                type="text"
                                placeholder="Flat No."
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Street</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.street ? personalDetails.street : ""}
                                type="text"
                                placeholder="Street Name"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Village</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.village ? personalDetails.village : ""}
                                type="text"
                                placeholder="Village"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Town</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.town ? personalDetails.town : ""}
                                type="text"
                                placeholder="Town"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Police Station</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.police_station ? personalDetails.police_station : ""}
                                type="text"
                                placeholder="Police Station"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Post Office</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.police_office ? personalDetails.police_office : ""}
                                type="text"
                                placeholder="Police Office"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">District</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.district ? personalDetails.district : ""}
                                type="text"
                                placeholder="District"
                              />
                            </div>

                            <div className="col-md-6">
                              <span className="field_information">Country</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.country ? personalDetails.country : ""}
                                type="text"
                                placeholder="Country"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">State</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.state ? personalDetails.state : ""}
                                type="text"
                                placeholder="State"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">City</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.city ? personalDetails.city : ""}
                                type="text"
                                placeholder="City"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">ZIP Code</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.zipcode ? personalDetails.zipcode : ""}
                                type="text"
                                placeholder="ZIP / Postal Code"
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.approveUserData("personalDetails")}
                                type="submit"
                                className="form-button"
                                value={
                                  personalDetails === undefined
                                    ? "VERIFY"
                                    : personalDetails.isApproved
                                    ? "UNVERIFY"
                                    : "VERIFY"
                                }
                              />
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                    <Panel header="Business Details" key="2">
                      {businessDetails ? (
                        <form className="custom-form">
                          <Divider orientation="left">Business Details</Divider>
                          <div className="row">
                            <div className="col-md-12">
                              <span className="field_information">Firm</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.firm ? businessDetails.firm : ""}
                                type="text"
                                placeholder="Firm"
                              />
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Business Type</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.type ? businessDetails.type : ""}
                                type="text"
                                placeholder="Type"
                              />
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Office Address</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.office_address ? businessDetails.office_address : ""}
                                type="text"
                                placeholder="Office Address"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Building Name</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.building_name ? businessDetails.building_name : ""}
                                type="text"
                                placeholder="Building Name"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Building Number</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.building_no ? businessDetails.building_no : ""}
                                type="text"
                                placeholder="Building Number"
                              />
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Street</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.street ? businessDetails.street : ""}
                                type="text"
                                placeholder="Street"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Village</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.village ? businessDetails.village : ""}
                                type="text"
                                placeholder="Village"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Town</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.town ? businessDetails.town : ""}
                                type="text"
                                placeholder="Town"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">City</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.city ? businessDetails.city : ""}
                                type="text"
                                placeholder="City"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Police Station</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.police_station ? businessDetails.police_station : ""}
                                type="text"
                                placeholder="Police Station"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Post Office</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.police_office ? businessDetails.police_office : ""}
                                type="text"
                                placeholder="Police Office"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">District</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.district ? businessDetails.district : ""}
                                type="text"
                                placeholder="District"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">State</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.state ? businessDetails.state : ""}
                                type="text"
                                placeholder="State"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Country</span>
                              <input
                                readOnly
                                defaultValue={businessDetails.country ? businessDetails.country : ""}
                                type="text"
                                placeholder="Country"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.approveUserData("businessDetails")}
                                type="submit"
                                className="form-button"
                                value={
                                  businessDetails === undefined
                                    ? "VERIFY"
                                    : businessDetails.isApproved
                                    ? "UNVERIFY"
                                    : "VERIFY"
                                }
                              />
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                    <Panel header="Statutory Detail" key="3">
                      {statutoryDetails || userDocuments ? (
                        <form className="custom-form">
                          <Divider orientation="left">Statutory Details</Divider>
                          <div className="row">
                            <div className="col-md-6">
                              <span className="field_information">Business PAN</span>
                              <input readOnly defaultValue={statutoryDetails.pan} type="text" placeholder="PAN" />
                              {userDocuments.panLink ? (
                                userDocuments.panLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.panLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.panLink} />
                                )
                              ) : null}
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("pan")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.ispanapproved ? "UNVERIFY" : "VERIFY"}
                              />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Trade License</span>
                              <input
                                readOnly
                                defaultValue={statutoryDetails.trade_license}
                                type="text"
                                placeholder="TRADE LICENSE"
                              />
                              {userDocuments.trade_licenseLink ? (
                                userDocuments.trade_licenseLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.trade_licenseLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.trade_licenseLink} />
                                )
                              ) : null}
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("trade_license")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.istrade_licenseapproved ? "UNVERIFY" : "VERIFY"}
                              />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">FSAAI License</span>
                              <input
                                readOnly
                                defaultValue={statutoryDetails.fsaai_license}
                                type="text"
                                placeholder="FSAAI LICENSE"
                              />
                              {userDocuments.fsaai_licenseLink ? (
                                userDocuments.fsaai_licenseLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.fsaai_licenseLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.fsaai_licenseLink} />
                                )
                              ) : null}
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("fsaai_license")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.isfsaai_licenseapproved ? "UNVERIFY" : "VERIFY"}
                              />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Personal PAN</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.panno}
                                type="text"
                                placeholder="Business PAN"
                              />
                              {userDocuments.business_panLink ? (
                                userDocuments.business_panLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.business_panLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.business_panLink} />
                                )
                              ) : null}
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("business_pan")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.isbusiness_panapproved ? "UNVERIFY" : "VERIFY"}
                              />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">AADHAR Number</span>
                              <input
                                readOnly
                                defaultValue={personalDetails.aadharno}
                                type="text"
                                placeholder="AADHAR Number"
                              />
                              {userDocuments.aadharLink ? (
                                userDocuments.aadharLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.aadharLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.aadharLink} />
                                )
                              ) : null}

                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("aadhar")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.isaadharapproved ? "UNVERIFY" : "VERIFY"}
                              />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                          </div>
                          {/* <div className="row">
                          <div className="col-md-12">
                            <input
                              style={{ cursor: "pointer" }}
                              onClick={this.approveUserData("statutoryDetails")}
                              type="submit"
                              className="form-button"
                              value={
                                statutoryDetails.isApproved
                                  ? "UNVERIFY"
                                  : "VERIFY"
                              }
                            />
                          </div>
                        </div> */}
                          <div className="row">
                            <div className="col-md-6">
                              <Divider orientation="left">CANCELLED CHEQUE</Divider>
                              {userDocuments.cancelled_chequeLink ? (
                                userDocuments.cancelled_chequeLink.includes(".pdf") ? (
                                  <Viewer fileUrl={userDocuments.cancelled_chequeLink} />
                                ) : (
                                  <img alt="" style={{ display: "block" }} src={userDocuments.cancelled_chequeLink} />
                                )
                              ) : null}
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.verifyDocs("cancelled_cheque")}
                                type="submit"
                                className="form-button"
                                value={userDocuments.iscancelled_licenseapproved ? "UNVERIFY" : "VERIFY"}
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">GSTIN</span>
                              <input readOnly defaultValue={statutoryDetails.gstin} type="text" placeholder="GSTIN" />
                              {/* <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" /> */}
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                    <Panel header="Bank Detail" key="4">
                      {bankDetails ? (
                        <form className="custom-form">
                          <Divider orientation="left">Bank Details</Divider>
                          <div className="row">
                            <div className="col-md-12">
                              <span className="field_information">Bank Name</span>
                              <input readOnly defaultValue={bankDetails.name} type="text" placeholder="Name" />
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Branch</span>
                              <input readOnly defaultValue={bankDetails.branch} type="text" placeholder="Branch" />
                            </div>
                            <div className="col-md-12">
                              <span className="field_information">Address</span>
                              <input
                                readOnly
                                defaultValue={bankDetails.address}
                                type="text"
                                placeholder="Address Line 1"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">City</span>
                              <input readOnly defaultValue={bankDetails.city} type="text" placeholder="City" />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">ZIP Code</span>
                              <input
                                readOnly
                                defaultValue={bankDetails.zipcode}
                                type="text"
                                placeholder="ZIP / Postal Code"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">State</span>
                              <input readOnly defaultValue={bankDetails.state} type="text" placeholder="State" />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Country</span>
                              <input readOnly defaultValue={bankDetails.country} type="text" placeholder="Country" />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">IFSC</span>
                              <input readOnly defaultValue={bankDetails.ifsc} type="text" placeholder="IFSC" />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Account No</span>
                              <input
                                readOnly
                                defaultValue={bankDetails.account_no}
                                type="text"
                                placeholder="ACCOUNT NO."
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.approveUserData("bankDetails")}
                                type="submit"
                                className="form-button"
                                value={bankDetails.isApproved ? "UNVERIFY" : "VERIFY"}
                              />
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                    <Panel header="Paytm Detail" key="5">
                      {paytmDetails ? (
                        <form className="custom-form">
                          <Divider orientation="left">Paytm Details</Divider>
                          <div className="row">
                            <div className="col-md-6">
                              <span className="field_information">Paytm No</span>
                              <input
                                readOnly
                                defaultValue={paytmDetails.paytm_no}
                                type="text"
                                placeholder="Paytm Number"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Paytm UPI</span>
                              <input
                                readOnly
                                defaultValue={paytmDetails.paytm_upi}
                                type="text"
                                placeholder="Paytm UPI ID"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.approveUserData("paytmDetails")}
                                type="submit"
                                className="form-button"
                                value={paytmDetails.isApproved ? "UNVERIFY" : "VERIFY"}
                              />
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                    <Panel header="Agreement" key="7">
                      {agreementDetails ? (
                        <form className="custom-form">
                          <Divider orientation="left">Agreement</Divider>
                          <div className="row">
                            <div className="col-md-6">
                              <span className="field_information">Document Number</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.document_no}
                                type="text"
                                placeholder="Document Number"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Issuing Authority</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.issuing_authority}
                                type="text"
                                placeholder="Issuing Authority"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Date of Issue</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.date_of_issue}
                                type="date"
                                placeholder=""
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Date of Expiry</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.date_of_expire}
                                type="date"
                                placeholder=""
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">State</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.state}
                                type="text"
                                placeholder="State of Issue"
                              />
                            </div>
                            <div className="col-md-6">
                              <span className="field_information">Country</span>
                              <input
                                readOnly
                                defaultValue={agreementDetails.country}
                                type="text"
                                placeholder="Country of Issue"
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <input
                                style={{ cursor: "pointer" }}
                                onClick={this.approveUserData("agreementDetails")}
                                type="submit"
                                className="form-button"
                                value={agreementDetails.isApproved ? "UNVERIFY" : "VERIFY"}
                              />
                            </div>
                          </div>
                        </form>
                      ) : null}
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>Created by amarnathmodi ©2020</Footer>
          </Layout>
        </Layout>
      </div>
      // 		);
      // 	default:
      // 		return <h1>HELLLO THERE!</h1>;
      // }
      // }
    );
  }
}

export default withRouter(singleuser);
