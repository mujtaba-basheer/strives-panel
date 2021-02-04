import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, PageHeader, message, Select, Checkbox } from "antd";
import apiCall from "../utils/apiCall";

import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
export default class addmanager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectslist: [],
      managerslist: [],
      partnerType: "",
      managerType: "",
      companyList: [],
      accessMasterData: false,
      companyAssigned: undefined,
    };
  }
  componentDidMount = async () => {
    // let response = apiCall.get("getObject");
    // let response1 = apiCall.get("getManagers");
    // let response2 = apiCall.get("getComapnyList");
    // let data = await Promise.all([response, response1, response2]);
    // if (data[0].data.status) {
    //   this.setState({
    //     objectslist: data[0].data.data,
    //   });
    // } else {
    //   message.error(`${response.data.message}`);
    // }
    // if (data[1].data.status) {
    //   this.setState({
    //     managerslist: data[1].data.data.filter(
    //       ({ managerType }) => managerType === "senior"
    //     ),
    //   });
    // } else {
    //   message.error(`${response.data.message}`);
    // }
    // if (data[2].data.status) {
    //   this.setState({
    //     companyList: data[2].data.data,
    //   });
    // } else {
    //   message.error(`${response.data.message}`);
    // }
  };
  addManager = async () => {
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      userType: "manager",
      phone: this.state.phone,
      managerType: this.state.managerType,
      partnerType: this.state.partnerType,
      managerAssigned: this.state.managerAssigned,
      accessMasterData: this.state.accessMasterData,
      companyAssigned: this.state.companyAssigned,
      objectAssigned: this.state.objectAssigned
        ? this.state.objectAssigned
        : [],
    };

    let response = await apiCall.post("addManager", data);
    if (response.data.status) {
      this.setState({
        name: "",
        email: "",
        password: "",
        userType: "",
        phone: "",
        objectAssigned: [],
        showMasterData: true,
        companyAssigned: undefined,
      });
      message.success("User Added");
    } else {
      message.error(`${response.data.message}`);
    }
  };
  render() {
    const { companyList } = this.state;

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"7"} />
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
                    title="Add Manager"
                    subTitle=""
                  />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.addManager();
                    }}
                    className="custom-form"
                  >
                    <div className="row">
                      <div className="col-md-6">
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
                      <div className="col-md-6">
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
                      <div className="col-md-6">
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
                          mode="single"
                          onChange={(e) =>
                            this.setState({
                              partnerType: e,
                            })
                          }
                          className="ant-d-form-fields"
                          showSearch
                          required
                          style={{ width: 200 }}
                          placeholder="Select Type"
                          optionFilterProp="children"
                        >
                          <Option value="GST Auditor">GST Auditor</Option>
                          <Option value="Statutory Auditor">
                            Statutory Auditor
                          </Option>
                          <Option value="Internal Auditor">
                            Internal Auditor
                          </Option>
                          <Option value="Production Manager">
                            Production Manager
                          </Option>
                          <Option value="Financer">Financer</Option>
                          <Option value="Manager">Manager</Option>
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
                          {companyList.map((item) => {
                            return (
                              <Option key={item._id} value={item._id}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
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
                          style={{
                            width: "200",
                          }}
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
                      <div className="col-md-6">
                        <Select
                          mode="single"
                          onChange={(e) =>
                            this.setState({
                              managerType: e,
                            })
                          }
                          className="ant-d-form-fields"
                          showSearch
                          required
                          style={{ width: 200 }}
                          placeholder="Select Manager Type"
                          optionFilterProp="children"
                        >
                          <Option value="senior">Senior Manager</Option>
                          <Option value="junior">Junior Manager</Option>
                        </Select>
                      </div>
                      {localStorage.getItem("userDetails") !== null &&
                      this.state.managerType === "junior" ? (
                        JSON.parse(localStorage.getItem("userDetails"))
                          .userType === "admin" ? (
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
                                  <Option value={item._id}>{item.name}</Option>
                                );
                              })}
                            </Select>
                          </div>
                        ) : null
                      ) : null}

                      <div className="col-md-6" style={{ display: "flex" }}>
                        <Checkbox
                          style={{
                            border: "1px solid grey",
                            padding: "13px 20px",
                            marginBottom: "15px",
                            width: "100%",
                          }}
                          checked={this.state.accessMasterData}
                          onChange={(e) =>
                            this.setState({
                              accessMasterData: e.target.checked,
                            })
                          }
                        >
                          Allow Access to Master Data
                        </Checkbox>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="submit"
                          className="form-button"
                          value="ADD MANAGER"
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
