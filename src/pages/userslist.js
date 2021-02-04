/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import Sidebar from "../common/sidebar";
import { Layout, Table, message, Select, Modal } from "antd";
import { Link } from "react-router-dom";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
export default class userslist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userslist: [],
      activeSet: {},
      objectslist: [],
      managerslist: [],
      companyList: [],
      visible: false,
    };
  }
  refreshApi = async () => {
    let response = await apiCall.get("getUsers");
    if (response.data.status) {
      this.setState({
        userslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };

  componentDidMount = async () => {
    this.refreshApi();
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
  limitUser = async (id, type) => {
    let response = await apiCall.post("limitUser", {
      userId: id,
      type: type,
    });
    if (response.data.status) {
      this.refreshApi();
      message.success(`${response.data.message}`);
    } else {
      message.error(`${response.data.message}`);
    }
  };

  setDefault = async (data) => {
    const defields = [];
    const activeSet = Object.assign({}, data);
    for (var i = 0; i < data.objectAssigned.length; i++) {
      defields.push(data.objectAssigned[i]._id);
    }
    activeSet.objectAssigned = defields;
    activeSet.companyAssigned =
      activeSet.companyAssigned.length > 0
        ? activeSet.companyAssigned[0]["_id"]
        : undefined;
    this.setState({ activeSet, visible: true });
  };

  editUser = async () => {
    var { activeSet } = this.state;
    console.log(activeSet);
    let update = await apiCall.post("updateUser", activeSet);
    if (update.data.status) {
      this.refreshApi();
      this.setState({ activeSet: {}, visible: false });
      message.success("User Updated");
    } else {
      message.error("Some error occured. Please try again.");
    }
  };
  render() {
    var pagination = {
      current: 1,
      pageSize: 1000,
    };
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Object Assigned",
        dataIndex: "objectAssigned",
        key: "objectAssigned",
        render: (text, record) => (
          <React.Fragment>
            <ul>
              {text.map((item) => {
                return <li>{item.title}</li>;
              })}
            </ul>
          </React.Fragment>
        ),
      },
      {
        title: "Company Assigned",
        dataIndex: "companyAssigned",
        key: "companyAssigned",
        render: (text, record) => (text[0] ? text[0]["name"] : ""),
      },
      {
        title: "Last Login",
        dataIndex: "lastLogin",
        key: "lastLogin",
        render: (text, record) => (
          <React.Fragment>
            {text ? new Date(text).toLocaleString() : ""}
          </React.Fragment>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <React.Fragment>
            <Link
              to={{
                pathname: `/single-user/${record._id}`,
              }}
              style={{ marginRight: "10px" }}
            >
              View
            </Link>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                this.setDefault(record);
              }}
              style={{ marginRight: "10px" }}
            >
              Edit
            </a>
            {record.isBlocked ? (
              <Link
                onClick={(e) => {
                  this.limitUser(record._id, false);
                }}
                style={{ color: "darkred" }}
              >
                Un-block
              </Link>
            ) : (
              <Link
                onClick={(e) => {
                  this.limitUser(record._id, true);
                }}
                style={{ color: "darkred" }}
              >
                Block
              </Link>
            )}
          </React.Fragment>
        ),
      },
    ];
    var { activeSet } = this.state;
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"1"} />
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
                  <Table
                    className="userlisttable"
                    dataSource={this.state.userslist}
                    pagination={pagination}
                    columns={columns}
                  />
                </div>
              </div>
              <Modal
                title="Edit"
                visible={this.state.visible}
                onCancel={(e) => {
                  this.setState({
                    visible: false,
                    activeSet: {},
                  });
                }}
                footer={null}
                style={{
                  width: "100%!important",
                  maxWidth: "600px",
                }}
                className="w-100"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.editUser();
                        }}
                        className="custom-form"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              required
                              value={activeSet.name}
                              onChange={(e) => {
                                activeSet.name = e.target.value;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              type="text"
                              placeholder="Name"
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              required
                              value={activeSet.phone}
                              onChange={(e) => {
                                activeSet.phone = e.target.value;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              type="number"
                              placeholder="Phone"
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              readOnly
                              disabled
                              value={activeSet.email}
                              onChange={(e) => {
                                activeSet.email = e.target.value;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              type="email"
                              placeholder="Email"
                            />
                          </div>
                          <div className="col-md-6">
                            <Select
                              mode="multiple"
                              onChange={(e) => {
                                activeSet.objectAssigned = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{
                                width: 200,
                              }}
                              value={activeSet.objectAssigned}
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
                                    onChange={(e) => {
                                      activeSet.managerAssigned = e;
                                      this.setState({
                                        activeSet,
                                      });
                                    }}
                                    className="ant-d-form-fields"
                                    showSearch
                                    required
                                    style={{
                                      width: 200,
                                    }}
                                    value={activeSet.managerAssigned}
                                    placeholder="Assign Manager"
                                    optionFilterProp="children"
                                  >
                                    {this.state.managerslist.map((item) => {
                                      return (
                                        <Option value={item._id} key={item._id}>
                                          {item.name}
                                        </Option>
                                      );
                                    })}
                                  </Select>
                                </div>
                                <div className="col-md-6">
                                  <Select
                                    mode="single"
                                    value={activeSet.companyAssigned}
                                    onChange={(e) => {
                                      activeSet.companyAssigned = e;
                                      this.setState({
                                        activeSet,
                                      });
                                    }}
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
                                        <Option value={item._id} key={item._id}>
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
                              value="UPDATE USER"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal>
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
