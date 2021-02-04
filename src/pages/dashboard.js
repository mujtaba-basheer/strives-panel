/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import {
  Layout,
  Table,
  PageHeader,
  Modal,
  Divider,
  message,
  Select,
  Spin,
} from "antd";
import apiCall from "../utils/apiCall";
import { getUser } from "../utils/store";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import { Fragment } from "react";
const { Option } = Select;
const { Header, Content, Footer } = Layout;

export default class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalvisible: false,
      responses: [],
      userslist: [],
      activeSet: {},
      objectslist: [],
      managerslist: [],
      visible: false,
      statistics: {},
      user: getUser(),
      list: [],
      showUserModal: false,
      showResponseModal: false,
      loading: true,
      listLoading: true,
    };
  }

  refreshApi = async () => {
    this.setState({ loading: true });
    let response = await apiCall.get("getUsersSome");
    let response1 = await apiCall.get("getStats");
    let data = await Promise.all([response, response1]);
    if (data[0].data.status) {
      this.setState({
        userslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    if (data[1].data.status) {
      this.setState({ statistics: response1.data.data, loading: false });
    } else {
      message.error(`${response1.data.message}`);
    }
    this.setState({ loading: false });
  };

  getData = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getAllResponsesSome");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responses: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  componentDidMount = async () => {
    this.refreshApi();
    // this.getData();
    let response = apiCall.get("getObject");
    let response1 = apiCall.get("getManagers");
    let data = await Promise.all([response, response1]);
    if (data[0].data.status) {
      this.setState({
        objectslist: data[0].data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    if (data[1].data.status) {
      this.setState({
        managerslist: data[1].data.data,
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

  editUser = async () => {
    var { activeSet } = this.state;
    let update = await apiCall.post("updateUser", activeSet);
    if (update.data.status) {
      this.refreshApi();
      this.setState({ activeSet: {}, visible: false });
      message.success("User Updated");
    } else {
      message.error("Some error occured. Please try again.");
    }
  };

  setDefault = async (data) => {
    var { activeSet } = this.state;
    console.log(data);
    var defields = [];
    activeSet = Object.assign({}, data);
    for (var i = 0; i < data.objectAssigned.length; i++) {
      defields.push(data.objectAssigned[i]._id);
    }
    activeSet.objectAssigned = defields;
    this.setState({ activeSet, visible: true });
  };

  openList = async ({ type, field }) => {
    const options = { listLoading: true };
    switch (type) {
      case "users":
        options["showUserModal"] = true;
        break;
      case "responses":
        options["showResponseModal"] = true;
        break;
      default:
        break;
    }
    this.setState(options);
    const resp = await apiCall.get(`getStatsList/${type}/${field}`);
    if (resp.data.status) {
      this.setState({
        list: resp.data.data,
        listLoading: false,
      });
    }
  };

  render() {
    var pagination = {
      current: 1,
      pageSize: 1000,
    };
    const {
      statistics,
      user: { userType, managerType },
    } = this.state;
    const isAdmin = userType === "admin",
      // isManager = userType === "manager",
      isSrManager = managerType === "senior";

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

    const userColumns = [
      {
        title: "Sl. No.",
        key: "sl_no",
        render: (text, record, index) => index + 1,
        width: 75,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 175,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 250,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 150,
      },
    ];

    const responseColumns = [
      {
        title: "Sl. No.",
        key: "sl_no",
        render: (text, record, index) => index + 1,
        width: 75,
      },
      {
        title: "Object Name",
        dataIndex: "objectName",
        key: "objectName",
        width: 175,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 125,
      },
      {
        title: "User",
        dataIndex: "User",
        key: "User",
        width: 200,
      },
    ];

    var {
      activeSet,
      showUserModal,
      showResponseModal,
      loading,
      listLoading,
    } = this.state;
    console.log(this.state);
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
            {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
              }}
            >
              <Spin size="large" spinning={loading}>
                <div
                  className="site-layout-background"
                  style={{ padding: 24, textAlign: "center" }}
                >
                  <div className="row">
                    <div className="col-md-6 col-lg-4">
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noOfWorkers}</h1>
                            <p>Total Users</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(isAdmin || isSrManager) && (
                      <div className="col-md-6 col-lg-4">
                        <div className="main-content">
                          <div className="main-analytic-box-wrapper d-flex align-items-center">
                            <img
                              alt=""
                              src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                            />
                            <div>
                              <h1>{statistics.noOfJrManagers}</h1>
                              <p>Junior Managers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="col-md-6 col-lg-4">
                        <div className="main-content">
                          <div className="main-analytic-box-wrapper d-flex align-items-center">
                            <img
                              alt=""
                              src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                            />
                            <div>
                              <h1>{statistics.noOfSrManagers}</h1>
                              <p>Senior Managers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="col-md-6 col-lg-4">
                        <div className="main-content">
                          <div className="main-analytic-box-wrapper d-flex align-items-center">
                            <img
                              alt=""
                              src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                            />
                            <div>
                              <h1>{statistics.noOfFields}</h1>
                              <p>Total Fields</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="col-md-6 col-lg-4">
                        <div className="main-content">
                          <div className="main-analytic-box-wrapper d-flex align-items-center">
                            <img
                              alt=""
                              src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                            />
                            <div>
                              <h1>{statistics.noOfObjects}</h1>
                              <p>Total Objects</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6 col-lg-4">
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noOfResponses}</h1>
                            <p>Total Responses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(isAdmin || isSrManager) && (
                      <Fragment>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noApprResJr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noApprResJr}</h1>
                                <p>Approved Responses by Jr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noDefectiveResJr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noDefectiveResJr}</h1>
                                <p>Defective Responses by Jr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noUnApprResJr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noUnApprResJr}</h1>
                                <p>Unapproved Responses by Jr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )}
                    {isAdmin && (
                      <Fragment>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noApprResSr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noApprResSr}</h1>
                                <p>Approved Responses by Sr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noDefectiveResSr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noDefectiveResSr}</h1>
                                <p>Defective Responses by Sr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            this.openList({
                              type: "responses",
                              field: "noUnApprResSr",
                            });
                          }}
                          style={{ cursor: "pointer" }}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="main-content">
                            <div className="main-analytic-box-wrapper d-flex align-items-center">
                              <img
                                alt=""
                                src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                              />
                              <div>
                                <h1>{statistics.noUnApprResSr}</h1>
                                <p>Unapproved Responses by Sr. Manager</p>
                                <span className="stats-view-more-modal">
                                  <u>(Click to view more)</u>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )}
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.openList({
                          type: "users",
                          field: "personalDetails",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      className="col-md-6 col-lg-4"
                    >
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noPersDetails}</h1>
                            <p>Users without Personal Details</p>
                            <span className="stats-view-more-modal">
                              <u>(Click to view more)</u>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.openList({
                          type: "users",
                          field: "businessDetails",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      className="col-md-6 col-lg-4"
                    >
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noBusyDetails}</h1>
                            <p>Users without Business Details</p>
                            <span className="stats-view-more-modal">
                              <u>(Click to view more)</u>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.openList({ type: "users", field: "paytmDetails" });
                      }}
                      style={{ cursor: "pointer" }}
                      className="col-md-6 col-lg-4"
                    >
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noPaytmDetails}</h1>
                            <p>Users without Paytm Details</p>
                            <span className="stats-view-more-modal">
                              <u>(Click to view more)</u>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.openList({ type: "users", field: "bankDetails" });
                      }}
                      style={{ cursor: "pointer" }}
                      className="col-md-6 col-lg-4"
                    >
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noBankDetails}</h1>
                            <p>Users without Bank Details</p>
                            <span className="stats-view-more-modal">
                              <u>(Click to view more)</u>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.openList({
                          type: "users",
                          field: "statutoryDetails`",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      className="col-md-6 col-lg-4"
                    >
                      <div className="main-content">
                        <div className="main-analytic-box-wrapper d-flex align-items-center">
                          <img
                            alt=""
                            src="https://www.flaticon.com/svg/static/icons/svg/888/888348.svg"
                          />
                          <div>
                            <h1>{statistics.noStatDetails}</h1>
                            <p>Users without Statutory Details</p>
                            <span className="stats-view-more-modal">
                              <u>(Click to view more)</u>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="main-content">
                    <div className="response-main-wrapper width-five">
                      <PageHeader
                        className="site-page-header"
                        onBack={null}
                        title="Recent Added Users"
                        subTitle=""
                      />
                      <Table
                        className="userlisttable"
                        dataSource={this.state.userslist}
                        pagination={pagination}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </Spin>
              <Modal
                title={"Users' List"}
                visible={showUserModal}
                onCancel={() => {
                  this.setState({
                    showUserModal: false,
                    list: [],
                  });
                }}
                footer={null}
                width={700}
              >
                <div className="row">
                  <Spin spinning={listLoading}>
                    <Table
                      className="userlisttable"
                      dataSource={this.state.list}
                      pagination={false}
                      columns={userColumns}
                      scroll={{ y: 500 }}
                    />
                  </Spin>
                </div>
              </Modal>
              <Modal
                title={"Responses' List"}
                visible={showResponseModal}
                onCancel={() => {
                  this.setState({
                    showResponseModal: false,
                    list: [],
                  });
                }}
                footer={null}
                width={600}
              >
                <div className="row">
                  <Spin spinning={listLoading}>
                    <Table
                      className="userlisttable"
                      dataSource={this.state.list}
                      pagination={false}
                      columns={responseColumns}
                      scroll={{ y: 500 }}
                    />
                  </Spin>
                </div>
              </Modal>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Created by amarnathmodi ©2020
            </Footer>
          </Layout>
        </Layout>
        <Modal
          title="User Details"
          visible={this.state.modalvisible}
          onOk={this.handleOk}
          onCancel={(e) => {
            this.setState({ modalvisible: false });
          }}
          width="90%"
          footer={null}
        >
          <div className="user-review-modal">
            <Divider orientation="left">Personal Details</Divider>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Profile Photo</div>
                  <div className="review-form-data">
                    <img
                      alt=""
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSadkyJvT4wdh6RmJ15M0BlLLpkefGnhZJiHVG6YmwpnsiWNMS4&usqp=CAU"
                      style={{
                        width: "120px",
                        height: "auto",
                        borderRadius: "50%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Name</div>
                  <div className="review-form-data">Belal Ahmad</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">DOB</div>
                  <div className="review-form-data">1st April, 1999</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">DOA</div>
                  <div className="review-form-data">21st March, 2020</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Aadhar Number</div>
                  <div className="review-form-data">2324 3434 4343</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">PAN Number</div>
                  <div className="review-form-data">SDFSD4RFRF</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">FATHER</div>
                  <div className="review-form-data">JONH Doe</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Address Line 1</div>
                  <div className="review-form-data">10 Browing Street</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Address Line 2</div>
                  <div className="review-form-data">London</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">City</div>
                  <div className="review-form-data">London</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">ZIP / Postal Code</div>
                  <div className="review-form-data">35324</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">State</div>
                  <div className="review-form-data">England</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Country</div>
                  <div className="review-form-data">UK</div>
                </div>
              </div>
            </div>
            <Divider orientation="left">Business Details</Divider>
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Firm</div>
                  <div className="review-form-data">Fleapo</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Type</div>
                  <div className="review-form-data">Information Technology</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Office Address</div>
                  <div className="review-form-data">16 Royd Street</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Building Name</div>
                  <div className="review-form-data">Royd Plaza</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header ">Building Number</div>
                  <div className="review-form-data">16</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Street</div>
                  <div className="review-form-data">Royd Street</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Village</div>
                  <div className="review-form-data">-</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Town</div>
                  <div className="review-form-data">-</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">City</div>
                  <div className="review-form-data">Kolkata_</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Police Station</div>
                  <div className="review-form-data">Park Street</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Police Office</div>
                  <div className="review-form-data">Park Street</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">District</div>
                  <div className="review-form-data">Kolkata</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">State</div>
                  <div className="review-form-data">West Bengal</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Country</div>
                  <div className="review-form-data">India</div>
                </div>
              </div>
            </div>
            <Divider orientation="left">Statutory Details</Divider>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">GSTIN</div>
                  <div className="review-form-data">23456uhbvf456ytd</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">PAN</div>
                  <div className="review-form-data">56ujnbfrtyt</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">TRADE LICENSE</div>
                  <div className="review-form-data">345678ijhgfsdfg</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">FSAAI LICENSE</div>
                  <div className="review-form-data">wertyujhnbgvder56</div>
                </div>
              </div>
            </div>
            <Divider orientation="left">Bank Details</Divider>
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Name</div>
                  <div className="review-form-data">HDFC</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Branch</div>
                  <div className="review-form-data">Park Street</div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Address Line 1</div>
                  <div className="review-form-data">10, Park Street</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">City</div>
                  <div className="review-form-data">Kolkata</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">ZIP / Postal Code</div>
                  <div className="review-form-data">700016</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">State</div>
                  <div className="review-form-data">West Bengal</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Country</div>
                  <div className="review-form-data">India</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">IFSC</div>
                  <div className="review-form-data">HDFC4544453</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">ACCOUNT NO.</div>
                  <div className="review-form-data">34567875435456</div>
                </div>
              </div>
            </div>
            <Divider orientation="left">Paytm Details</Divider>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Paytm Number</div>
                  <div className="review-form-data">9876543210</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Paytm UPI ID</div>
                  <div className="review-form-data">fleapo@Paytm.com</div>
                </div>
              </div>
            </div>
            <Divider orientation="left">Documents</Divider>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Aadhar Card</div>
                  <div className="review-form-data">
                    <a
                      rel="noopener noreferrer"
                      href="http://placehold.it/600x600"
                      target="_blank"
                      class="attachment-box ripple-effect"
                      download=""
                    >
                      <span>Document</span>
                      <i>View/Download</i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">PAN Card</div>
                  <div className="review-form-data">
                    <a
                      href="http://placehold.it/600x600"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="attachment-box ripple-effect"
                      download=""
                    >
                      <span>Document</span>
                      <i>View/Download</i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Cancelled Cheque</div>
                  <div className="review-form-data">
                    <a
                      href="http://placehold.it/600x600"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="attachment-box ripple-effect"
                      download=""
                    >
                      <span>Document</span>
                      <i>View/Download</i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">Trade License</div>
                  <div className="review-form-data">
                    <a
                      href="http://placehold.it/600x600"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="attachment-box ripple-effect"
                      download=""
                    >
                      <span>Document</span>
                      <i>View/Download</i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex single-review-form-col">
                  <div className="review-form-header">FSSAI License</div>
                  <div className="review-form-data">
                    <a
                      href="http://placehold.it/600x600"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="attachment-box ripple-effect"
                      download=""
                    >
                      <span>Document</span>
                      <i>View/Download</i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <input type="submit" className="form-button" value="APPROVE" />
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Edit"
          visible={this.state.visible}
          onCancel={(e) => {
            this.setState({ visible: false, activeSet: {} });
          }}
          footer={null}
          style={{ width: "100%!important", maxWidth: "600px" }}
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
                        style={{ width: 200 }}
                        value={activeSet.objectAssigned}
                        placeholder="Select Object"
                        optionFilterProp="children"
                      >
                        {this.state.objectslist.map((item) => {
                          return <Option value={item._id}>{item.title}</Option>;
                        })}
                      </Select>
                    </div>
                    {localStorage.getItem("userDetails") !== null ? (
                      JSON.parse(localStorage.getItem("userDetails"))
                        .userType === "admin" ? (
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
                            style={{ width: 200 }}
                            value={activeSet.managerAssigned}
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
      </div>
    );
  }
}
