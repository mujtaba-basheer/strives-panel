import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, PageHeader, Spin, Table, Modal } from "antd";

import "antd/dist/antd.css";
import apiCall from "../utils/apiCall";
import { message } from "antd";
const { Header, Content, Footer } = Layout;

export default class responses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 5,
      responses: [],
      responsesnyUser: [],
      responsebyobject: [],
      loading: false,
      objectslist: [],
      commentsList: [],
      srManagerCommentList: [],
      statistics: {},
      list: [],
      listLoading: true,
      showUserModal: false,
      showResponseModal: false,
    };
  }

  getData = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getAllResponses");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responses: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  getData2 = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getAllResponsesDateDecending");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responses: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  getData3 = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getAllResponsesByUser");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responsesnyUser: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  getData4 = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getAllResponsesByObject");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responsebyobject: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  getData5 = async () => {
    try {
      this.setState({ loading: true });
      const response = await apiCall.get("getResponsesForSeniorManager");
      if (response.data.status) {
        const { data } = response.data;
        await this.setState({ responsebyobject: data });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  componentDidMount = async () => {
    const userDetails = JSON.parse(window.localStorage.getItem("userDetails"));
    this.setState({
      value: userDetails.managerType === "senior" ? 5 : 4,
      userType: userDetails.userType,
    });
    if (
      userDetails.userType === "manager" &&
      userDetails.managerType === "senior"
    )
      this.getData5();
    else this.getData4();
    let response = await apiCall.get("getObject");
    if (response.data.status) {
      this.setState({
        objectslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    let response1 = await apiCall.get("getStats");
    if (response1.data.status) {
      this.setState({ statistics: response1.data.data });
    } else {
      message.error(`${response1.data.message}`);
    }
  };

  addComment = (id, value) => {
    var { commentsList } = this.state;
    let commentIndex = commentsList.findIndex((x) => x.respondId === id);
    if (commentIndex > -1) {
      commentsList[commentIndex] = {
        respondId: id,
        comment: value,
      };
    } else {
      commentsList.push({
        respondId: id,
        comment: value,
      });
    }
    this.setState({ commentsList });
  };

  updateComment = async (value, id) => {
    var { commentsList } = this.state;
    let commentIndex = commentsList.findIndex((x) => x.respondId === id);
    let data = {
      respondId: id,
      isApproved: value,
    };
    if (commentIndex > -1) {
      data.comment = commentsList[commentIndex].comment;
    }
    let addComment = await apiCall.post("addcomment", data);
    if (addComment.data.status) {
      message.success("Updated!");
    }
  };

  addSrManagerComment = (id, value) => {
    var { srManagerCommentList } = this.state;
    let commentIndex = srManagerCommentList.findIndex(
      (x) => x.respondId === id
    );
    if (commentIndex > -1) {
      srManagerCommentList[commentIndex] = {
        respondId: id,
        comment: value,
      };
    } else {
      srManagerCommentList.push({
        respondId: id,
        comment: value,
      });
    }
    this.setState({ srManagerCommentList });
  };

  updateSrManagerComment = async (value, id) => {
    var { srManagerCommentList } = this.state;
    let commentIndex = srManagerCommentList.findIndex(
      (x) => x.respondId === id
    );
    let data = {
      respondId: id,
      isApproved: value,
    };
    if (commentIndex > -1) {
      data.comment = srManagerCommentList[commentIndex].comment;
    }
    let addComment = await apiCall.post("addSrManagerComment", data);
    if (addComment.data.status) {
      message.success("Updated!");
    }
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
    const {
      responses,
      responsesnyUser,
      responsebyobject,
      objectslist,
    } = this.state;
    const {
      statistics,
      showResponseModal,
      showUserModal,
      listLoading,
    } = this.state;
    console.log(this.state.commentsList);
    var col = [];

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

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"4"} />
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
                <div className="row">
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
                </div>
              </div>
              <div
                className="site-layout-background"
                style={{ padding: 24, textAlign: "center" }}
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content text-left">
                      <div
                        className="sort-by-filter"
                        style={{ marginBottom: "30px" }}
                      ></div>
                      <Spin spinning={this.state.loading}>
                        {this.state.value === 1 ? (
                          <div className="response-main-wrapper width-four">
                            <PageHeader
                              className="site-page-header"
                              onBack={null}
                              title="Date Ascending"
                              subTitle=""
                            />
                            {responses.length ? (
                              <div className="responses-list-wrapper">
                                {responses.map((res, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="single-response-item"
                                    >
                                      {res.photo
                                        .toLocaleLowerCase()
                                        .includes(".png") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".jpg") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".jpeg") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".tiff") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".bmp") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".tif") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".gif") ? (
                                        <img alt="" src={res.photo} />
                                      ) : (
                                        <a
                                          href={res.photo}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                          class="attachment-box ripple-effect"
                                          style={{
                                            margin: "0 auto 20px",
                                          }}
                                          download=""
                                        >
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
                                            <strong>
                                              {" "}
                                              {Object.keys(item)[0]} :{" "}
                                            </strong>{" "}
                                            {Object.values(item)[0]}
                                          </p>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                        {this.state.value === 2 ? (
                          <div className="response-main-wrapper width-four">
                            <PageHeader
                              className="site-page-header"
                              onBack={null}
                              title="Date Ascending"
                              subTitle=""
                            />
                            {responses.length ? (
                              <div className="responses-list-wrapper">
                                {responses.map((res, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="single-response-item"
                                    >
                                      {res.photo
                                        .toLocaleLowerCase()
                                        .includes(".png") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".jpg") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".jpeg") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".tiff") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".bmp") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".tif") ||
                                      res.photo
                                        .toLocaleLowerCase()
                                        .includes(".gif") ? (
                                        <img alt="" src={res.photo} />
                                      ) : (
                                        <a
                                          href={res.photo}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                          class="attachment-box ripple-effect"
                                          style={{
                                            margin: "0 auto 20px",
                                          }}
                                          download=""
                                        >
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
                                            <strong>
                                              {" "}
                                              {Object.keys(item)[0]} :{" "}
                                            </strong>{" "}
                                            {Object.values(item)[0]}
                                          </p>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                        {this.state.value === 3 ? (
                          <div className="response-main-wrapper width-four">
                            {responsesnyUser.map((item, index) => {
                              return item.data.length > 0 ? (
                                <React.Fragment>
                                  <PageHeader
                                    className="site-page-header"
                                    onBack={null}
                                    title={item._id.name}
                                    subTitle=""
                                  />
                                  <div className="responses-list-wrapper">
                                    {item.data.map((res, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="single-response-item"
                                        >
                                          {res.photo
                                            .toLocaleLowerCase()
                                            .includes(".png") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".jpg") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".jpeg") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".tiff") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".bmp") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".tif") ||
                                          res.photo
                                            .toLocaleLowerCase()
                                            .includes(".gif") ? (
                                            <img alt="" src={res.photo} />
                                          ) : (
                                            <a
                                              href={res.photo}
                                              rel="noopener noreferrer"
                                              target="_blank"
                                              class="attachment-box ripple-effect"
                                              style={{
                                                margin: "0 auto 20px",
                                              }}
                                              download=""
                                            >
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
                                                <strong>
                                                  {" "}
                                                  {Object.keys(item)[0]} :{" "}
                                                </strong>{" "}
                                                {Object.values(item)[0]}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </React.Fragment>
                              ) : null;
                            })}
                          </div>
                        ) : null}
                        {this.state.value === 4 ? (
                          <div className="response-main-wrapper width-four">
                            {responsebyobject.map((item, index) => {
                              return item.data.length > 0 ? (
                                <React.Fragment>
                                  <PageHeader
                                    className="site-page-header"
                                    onBack={null}
                                    title={item.title}
                                    subTitle=""
                                  />
                                  {
                                    ((col = [
                                      {
                                        title: "photo",
                                        dataIndex: "photo",
                                        key: "photo",
                                        render: (text) => {
                                          if (
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".png") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".jpg") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".jpeg") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".tiff") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".bmp") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".tif") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".gif")
                                          ) {
                                            return <img alt="" src={text} />;
                                          } else {
                                            return (
                                              <a
                                                href={text}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                class=""
                                                style={{
                                                  margin: "0 auto 20px",
                                                }}
                                                download=""
                                              >
                                                <i>View File</i>
                                              </a>
                                            );
                                          }
                                        },
                                      },
                                      {
                                        title: "User",
                                        dataIndex: "User",
                                        key: "User",
                                      },
                                      {
                                        title: "date",
                                        dataIndex: "date",
                                        key: "date",
                                      },
                                      {
                                        title: "objectName",
                                        dataIndex: "objectName",
                                        key: "objectName",
                                      },
                                    ]),
                                    (objectslist[
                                      objectslist.findIndex(
                                        (x) => x.title === item.title
                                      )
                                    ].fields.forEach((fielditem) => {
                                      col.push({
                                        title: fielditem.title,
                                        dataIndex: "data",
                                        render: (array) => {
                                          var index = array.findIndex(
                                            (x) => x[fielditem.title]
                                          );
                                          if (index > -1) {
                                            return array[index][
                                              fielditem.title
                                            ];
                                          }
                                        },
                                      });
                                    }),
                                    col.push({
                                      title: "Action",
                                      dataIndex: "requiresApproval",
                                      key: "requiresApproval",
                                      fixed: "right",
                                      width: 200,
                                      render: (text, record) => {
                                        if (text) {
                                          console.log(record);
                                          return (
                                            <div className="row">
                                              <div className="col-md-12">
                                                <textarea
                                                  value={
                                                    record.comment
                                                      ? record.comment.comment
                                                      : undefined
                                                  }
                                                  onBlur={(e) => {
                                                    this.addComment(
                                                      record._id,
                                                      e.target.value
                                                    );
                                                  }}
                                                  placeholder="Comments"
                                                ></textarea>
                                              </div>
                                              <div className="col-md-12">
                                                <select
                                                  onChange={(e) => {
                                                    this.updateComment(
                                                      JSON.parse(
                                                        e.target.value
                                                      ),
                                                      record._id
                                                    );
                                                  }}
                                                  defaultValue={
                                                    record.comment
                                                      ? record.comment
                                                          .isApproved
                                                      : "Select Approval"
                                                  }
                                                  placeholder="Select Approval"
                                                >
                                                  <option
                                                    value="Select Approval"
                                                    selected
                                                  >
                                                    Select Approval
                                                  </option>
                                                  <option value={true}>
                                                    Verified
                                                  </option>
                                                  <option value={false}>
                                                    Defective
                                                  </option>
                                                </select>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                        }
                                      },
                                    }),
                                    (
                                      <Table
                                        dataSource={item.data}
                                        columns={col}
                                        scroll={{
                                          x: 1800,
                                        }}
                                      />
                                    )))
                                  }

                                  <div className="responses-list-wrapper"></div>
                                </React.Fragment>
                              ) : null;
                            })}
                          </div>
                        ) : null}
                        {this.state.value === 5 ? (
                          <div className="response-main-wrapper width-four">
                            {responsebyobject.map((item, index) => {
                              return item.data.length > 0 ? (
                                <React.Fragment>
                                  <PageHeader
                                    className="site-page-header"
                                    onBack={null}
                                    title={item.title}
                                    subTitle=""
                                  />
                                  {
                                    ((col = [
                                      {
                                        title: "photo",
                                        dataIndex: "photo",
                                        key: "photo",
                                        render: (text) => {
                                          if (
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".png") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".jpg") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".jpeg") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".tiff") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".bmp") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".tif") ||
                                            text
                                              .toLocaleLowerCase()
                                              .includes(".gif")
                                          ) {
                                            return <img alt="" src={text} />;
                                          } else {
                                            return (
                                              <a
                                                href={text}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                class=""
                                                style={{
                                                  margin: "0 auto 20px",
                                                }}
                                                download=""
                                              >
                                                <i>View File</i>
                                              </a>
                                            );
                                          }
                                        },
                                      },
                                      {
                                        title: "User",
                                        dataIndex: "User",
                                        key: "User",
                                      },
                                      {
                                        title: "date",
                                        dataIndex: "date",
                                        key: "date",
                                      },
                                      {
                                        title: "objectName",
                                        dataIndex: "objectName",
                                        key: "objectName",
                                      },
                                    ]),
                                    (objectslist[
                                      objectslist.findIndex(
                                        (x) => x.title === item.title
                                      )
                                    ].fields.forEach((fielditem) => {
                                      col.push({
                                        title: fielditem.title,
                                        dataIndex: "data",
                                        render: (array) => {
                                          var index = array.findIndex(
                                            (x) => x[fielditem.title]
                                          );
                                          if (index > -1) {
                                            return array[index][
                                              fielditem.title
                                            ];
                                          }
                                        },
                                      });
                                    }),
                                    col.push({
                                      title: "Action by Junior Manager",
                                      dataIndex: "requiresApproval",
                                      key: "requiresApproval",
                                      width: 200,
                                      render: (text, record) => {
                                        if (text) {
                                          console.log(record);
                                          return (
                                            <div className="row">
                                              <div className="col-md-12">
                                                <textarea
                                                  disabled
                                                  value={
                                                    record.comment
                                                      ? record.comment.comment
                                                      : undefined
                                                  }
                                                  onBlur={(e) => {
                                                    this.addComment(
                                                      record._id,
                                                      e.target.value
                                                    );
                                                  }}
                                                  placeholder="Comments"
                                                ></textarea>
                                              </div>
                                              <div className="col-md-12">
                                                <select
                                                  disabled
                                                  onChange={(e) => {
                                                    this.updateComment(
                                                      JSON.parse(
                                                        e.target.value
                                                      ),
                                                      record._id
                                                    );
                                                  }}
                                                  defaultValue={
                                                    record.comment
                                                      ? record.comment
                                                          .isApproved
                                                      : "Select Approval"
                                                  }
                                                  placeholder="Select Approval"
                                                >
                                                  <option
                                                    value="Select Approval"
                                                    selected
                                                  >
                                                    Select Approval
                                                  </option>
                                                  <option value={true}>
                                                    Verified
                                                  </option>
                                                  <option value={false}>
                                                    Defective
                                                  </option>
                                                </select>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                        }
                                      },
                                    }),
                                    col.push({
                                      title: "Action by Senior Manager",
                                      dataIndex: "requiresApproval",
                                      key: "requiresApproval",
                                      fixed: "right",
                                      width: 200,
                                      render: (text, record) => {
                                        if (text) {
                                          console.log(record);
                                          return (
                                            <div className="row">
                                              <div className="col-md-12">
                                                <textarea
                                                  value={
                                                    record.SrManagerComment
                                                      ? record.SrManagerComment
                                                          .comment
                                                      : undefined
                                                  }
                                                  onBlur={(e) => {
                                                    this.addSrManagerComment(
                                                      record._id,
                                                      e.target.value
                                                    );
                                                  }}
                                                  placeholder="Comments"
                                                ></textarea>
                                              </div>
                                              <div className="col-md-12">
                                                <select
                                                  onChange={(e) => {
                                                    this.updateSrManagerComment(
                                                      JSON.parse(
                                                        e.target.value
                                                      ),
                                                      record._id
                                                    );
                                                  }}
                                                  defaultValue={
                                                    record.SrManagerComment
                                                      ? record.SrManagerComment
                                                          .isApproved
                                                      : "Select Approval"
                                                  }
                                                  placeholder="Select Approval"
                                                >
                                                  <option
                                                    disabled
                                                    value="Select Approval"
                                                    selected
                                                  >
                                                    Select Approval
                                                  </option>
                                                  <option value={true}>
                                                    Verified
                                                  </option>
                                                  <option value={false}>
                                                    Defective
                                                  </option>
                                                </select>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                        }
                                      },
                                    }),
                                    (
                                      <Table
                                        dataSource={item.data}
                                        columns={col}
                                        scroll={{
                                          x: 1800,
                                        }}
                                      />
                                    )))
                                  }

                                  <div className="responses-list-wrapper"></div>
                                </React.Fragment>
                              ) : null;
                            })}
                          </div>
                        ) : null}
                      </Spin>
                    </div>
                  </div>
                </div>
              </div>
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
      </div>
    );
  }
}
