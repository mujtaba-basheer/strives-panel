import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import Notification from "../common/notifi";
import { Layout, PageHeader, Collapse, message } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
import Personaldetails from "./User/personaldetails";
import Businessdetails from "./User/businessdetails";
import DocumentDetails from "./User/documentDetails";
import Statutorydetails from "./User/statutorydetails";
import Bankdetails from "./User/bankdetails";
import Paytmdetails from "./User/paytmdetails";
import Agreementdetails from "./User/agreementdetails";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;
export default class myprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: {
        password: "",
        newPassword: "",
        reEnterPassword: "",
      },
    };
  }

  render() {
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
              }}
            >
              <img
                src="/menu.png"
                alt=""
                style={{
                  cursor: "pointer",
                  width: "20px",
                  marginLeft: "20px",
                }}
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
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
              }}
            >
              <div
                className="site-layout-background"
                style={{ padding: 24, textAlign: "center" }}
              >
                <div className="main-content">
                  <PageHeader
                    className="site-page-header"
                    onBack={null}
                    title="Edit Profile"
                    subTitle=""
                  />
                  <Collapse defaultActiveKey={["1"]}>
                    <Panel header="Personal Details" key="1">
                      <Personaldetails />
                    </Panel>
                    <Panel header="Business Details" key="2">
                      <Businessdetails />
                    </Panel>
                    <Panel header="Statutory Detail" key="3">
                      <Statutorydetails />
                    </Panel>
                    <Panel header="Bank Detail" key="4">
                      <Bankdetails />
                    </Panel>
                    <Panel header="Paytm Detail" key="5">
                      <Paytmdetails />
                    </Panel>
                    <Panel header="Documents" key="6">
                      <DocumentDetails />
                    </Panel>
                    <Panel header="Agreement" key="7">
                      <Agreementdetails />
                    </Panel>
                  </Collapse>
                </div>
                <div className="main-content">
                  <PageHeader
                    className="site-page-header"
                    onBack={null}
                    title="Edit Password"
                    subTitle=""
                  />
                  <form className="custom-form">
                    <div className="row">
                      <div className="col-md-4">
                        <input type="password" placeholder="Current Password" />
                      </div>
                      <div className="col-md-4">
                        <input type="password" placeholder="New Password" />
                      </div>
                      <div className="col-md-4">
                        <input
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
