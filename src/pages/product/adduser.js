import React, { Component, Fragment } from "react";
import Sidebar from "../common/sidebar";
import { Layout, PageHeader, message, Select } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
export default class adduser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectslist: [],
      managerslist: [],
      objectAssigned: [],
      companyList: [],
    };
  }
  componentDidMount = async () => {
    let response = apiCall.get("getObject");
    let response1 = apiCall.get("getManagers");
    let response2 = apiCall.get("getComapnyList");
    let data = await Promise.all([response, response1, response2]);
    if (data[0].data.status) {
      this.setState({
        objectslist: data[0].data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    if (data[1].data.status) {
      this.setState({
        managerslist: data[1].data.data.filter(
          ({ managerType }) => managerType === "junior"
        ),
      });
    } else {
      message.error(`${response.data.message}`);
    }
    if (data[2].data.status) {
      this.setState({
        companyList: data[2].data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  addUser = async () => {
    // if (this.state.objectAssigned.length === 0) {
    //   message.error("Please assign object");
    // } else {
    let response = await apiCall.post("addUsers", {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      userType: "worker",
      phone: this.state.phone,
      objectAssigned: this.state.objectAssigned,
      managerAssigned: this.state.managerAssigned,
      companyAssigned: this.state.companyAssigned,
    });
    if (response.data.status) {
      this.setState({
        name: "",
        email: "",
        password: "",
        userType: "",
        phone: "",
        objectAssigned: "",
        managerAssigned: "",
        companyAssigned: "",
      });
      message.success("User Added");
    } else {
      message.error(`${response.data.message}`);
    }
    // }
  };
  render() {
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"6"} />
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
                    title="Add User"
                    subTitle=""
                  />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.addUser();
                    }}
                    className="custom-form"
                  >
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          required
                          value={this.state.name}
                          onChange={(e) =>
                            this.setState({
                              name: e.target.value,
                            })
                          }
                          type="text"
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          required
                          value={this.state.phone}
                          onChange={(e) =>
                            this.setState({
                              phone: e.target.value,
                            })
                          }
                          type="number"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          required
                          value={this.state.email}
                          onChange={(e) =>
                            this.setState({
                              email: e.target.value,
                            })
                          }
                          type="email"
                          placeholder="Email"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          required
                          value={this.state.password}
                          onChange={(e) =>
                            this.setState({
                              password: e.target.value,
                            })
                          }
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                      <div className="col-md-6">
                        <Select
                          mode="multiple"
                          onChange={(e) =>
                            this.setState({
                              objectAssigned: e,
                            })
                          }
                          className="ant-d-form-fields"
                          showSearch
                          required
                          style={{ width: 200 }}
                          placeholder="Select Object"
                          optionFilterProp="children"
                        >
                          {this.state.objectslist.map((item) => {
                            return (
                              <Option value={item._id}>{item.title}</Option>
                            );
                          })}
                        </Select>
                      </div>
                      {localStorage.getItem("userDetails") !== null ? (
                        JSON.parse(localStorage.getItem("userDetails"))
                          .userType === "admin" ? (
                          <Fragment>
                            <div className="col-md-6">
                              <Select
                                mode="single"
                                onChange={(e) =>
                                  this.setState({
                                    managerAssigned: e,
                                  })
                                }
                                className="ant-d-form-fields"
                                showSearch
                                required
                                style={{
                                  width: 200,
                                }}
                                placeholder="Assign Manager"
                                optionFilterProp="children"
                              >
                                {this.state.managerslist.map((item) => {
                                  return (
                                    <Option value={item._id}>
                                      {item.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                            <div className="col-md-6">
                              <Select
                                mode="single"
                                onChange={(e) =>
                                  this.setState({
                                    companyAssigned: e,
                                  })
                                }
                                className="ant-d-form-fields"
                                showSearch
                                required
                                style={{
                                  width: 200,
                                }}
                                placeholder="Assign Company"
                                optionFilterProp="children"
                              >
                                {this.state.companyList.map((item) => {
                                  return (
                                    <Option value={item._id}>
                                      {item.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                          </Fragment>
                        ) : null
                      ) : null}
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="submit"
                          className="form-button"
                          value="ADD USER"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Created by amarnathmodi ©2020
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
