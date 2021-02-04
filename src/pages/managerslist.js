/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import Sidebar from "../common/sidebar";
import { Layout, Table, message, Modal, Select, Checkbox } from "antd";
import { Link } from "react-router-dom";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
export default class managerslist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userslist: [],
      objectslist: [],
      activeSet: {},
      visible: false,
      srmanagers: [],
      companyList: [],
    };
  }
  refreshApi = async () => {
    let res = apiCall.get("getManagers");
    let res1 = apiCall.get("getComapnyList");
    const response = await Promise.all([res, res1]);
    if (response[0].data.status) {
      const srmanagers = response[0].data.data.filter(
        ({ managerType }) => managerType === "senior"
      );
      this.setState({
        userslist: response[0].data.data,
        srmanagers,
      });
    } else {
      message.error(`${response[0].data.message}`);
    }
    if (response[1].data.status) {
      this.setState({
        companyList: response[1].data.data,
      });
    } else {
      message.error(`${response[1].data.message}`);
    }
  };
  componentDidMount = async () => {
    this.refreshApi();
    let response = await apiCall.get("getObject");
    if (response.data.status) {
      this.setState({
        objectslist: response.data.data,
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
    console.log(data);
    var { activeSet } = this.state;
    var defields = [];
    activeSet = Object.assign({}, data);
    for (var i = 0; i < data.objectAssigned.length; i++) {
      defields.push(data.objectAssigned[i]._id);
    }
    activeSet.objectAssigned = defields;
    this.setState({ activeSet, visible: true });
  };
  editManager = async () => {
    var { activeSet } = this.state;
    console.log(activeSet);
    let update = await apiCall.post("updateManager", activeSet);
    if (update.data.status) {
      this.refreshApi();
      this.setState({ activeSet: {}, visible: false });
      message.success("Manager Updated");
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
        title: "Manager Type",
        dataIndex: "managerType",
        key: "managerType",
        render: (text, record) => (
          <Fragment>{text === "senior" ? "Senior" : "Junior"}</Fragment>
        ),
      },
      {
        title: "Master Access",
        dataIndex: "accessMasterData",
        key: "accessMasterData",
        render: (text, record) => <Fragment>{text ? "Yes" : "No"}</Fragment>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <React.Fragment>
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
    console.log(this.state.activeSet);
    var { activeSet, companyList } = this.state;
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"20"} />
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
                    className="managerlisttable"
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
                          this.editManager();
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
                          <div className="col-md-6">
                            <Select
                              mode="single"
                              onChange={(e) => {
                                activeSet.partnerType = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              value={activeSet.partnerType}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{
                                width: 200,
                              }}
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
                              onChange={(e) => {
                                activeSet.managerType = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              value={activeSet.managerType}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Manager Type"
                              optionFilterProp="children"
                            >
                              <Option value="senior">Senior Manager</Option>
                              <Option value="junior">Junior Manager</Option>
                            </Select>
                          </div>
                          {activeSet.managerType === "junior" ? (
                            <div className="col-md-6">
                              <Select
                                mode="single"
                                onChange={(e) => {
                                  activeSet.managerAssigned = e;
                                  this.setState({
                                    activeSet,
                                  });
                                }}
                                value={activeSet.managerAssigned}
                                className="ant-d-form-fields"
                                showSearch
                                required
                                style={{
                                  width: 200,
                                }}
                                placeholder="Select Sr. Manager"
                                optionFilterProp="children"
                              >
                                {this.state.srmanagers.map(({ _id, name }) => (
                                  <Option value={_id} key={_id}>
                                    {name}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          ) : null}
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
                              {companyList.map((item) => {
                                return (
                                  <Option value={item._id} key={item._id}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                          <div className="col-md-6" style={{ display: "flex" }}>
                            <Checkbox
                              style={{
                                border: "1px solid grey",
                                padding: "13px 20px",
                                marginBottom: "15px",
                                width: "100%",
                              }}
                              checked={activeSet.accessMasterData}
                              onChange={(e) => {
                                activeSet.accessMasterData = e.target.checked;
                                this.setState({
                                  activeSet,
                                });
                              }}
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
                              value="UPDATE MANAGER"
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
