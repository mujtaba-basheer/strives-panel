import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import Notification from "../common/notifi";
import { Layout, PageHeader, Empty } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

export default class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalvisible: false,
      responses: [],
    };
  }
  componentDidMount = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("myResponses");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responses: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  render() {
    var { responses } = this.state;
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"10"} />
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
                }}>
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
            {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div className="site-layout-background" style={{ padding: 24, textAlign: "center" }}>
                <div className="main-content">
                  {responses.length > 0 ? (
                    <div className="response-main-wrapper width-five">
                      <PageHeader className="site-page-header" onBack={null} title="My Responses" subTitle="" />
                      {responses.map((res, index) => {
                        return (
                          <div key={index} className="single-response-item">
                            {res.photo.toLocaleLowerCase().includes(".png") ||
                            res.photo.toLocaleLowerCase().includes(".jpg") ||
                            res.photo.toLocaleLowerCase().includes(".jpeg") ||
                            res.photo.toLocaleLowerCase().includes(".tiff") ||
                            res.photo.toLocaleLowerCase().includes(".bmp") ||
                            res.photo.toLocaleLowerCase().includes(".tif") ||
                            res.photo.toLocaleLowerCase().includes(".gif") ? (
                              <img alt="" src={res.photo} />
                            ) : (
                              <a
                                href={res.photo}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="attachment-box ripple-effect"
                                style={{ margin: "0 auto 20px" }}
                                download="">
                                <span>PDF</span>
                                <i>View File</i>
                              </a>
                            )}
                            <p>
                              <strong>User: </strong>
                              {res.User}
                            </p>
                            <p>
                              <strong>Object : </strong>
                              {res.objectName}
                            </p>
                            <p>
                              <strong>Date : </strong>
                              {res.date}
                            </p>
                            {res.data.map((item, index) => {
                              return (
                                <p>
                                  <strong> {Object.keys(item)[0]} : </strong> {Object.values(item)[0]}
                                </p>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <React.Fragment>
                      <PageHeader className="site-page-header" onBack={null} title="My Responses" subTitle="" />
                      <Empty />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </Content>
            <Notification />
            <Footer style={{ textAlign: "center" }}>Created by amarnathmodi ©2020</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
