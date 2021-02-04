/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, Table, PageHeader, Select, message, Modal } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;

export default class objectslist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      fields: [],
      fieldslist: [],
      objectslist: [],
      visible: false,
      activeSet: {},
      objectTypeList: [],
    };
  }
  refreshAPi = async () => {
    let response = await apiCall.get("getObject");
    if (response.data.status) {
      this.setState({
        objectslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  componentDidMount = async () => {
    this.refreshAPi();
    let response = await apiCall.get("getField");
    if (response.data.status) {
      this.setState({
        fieldslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    let response2 = await apiCall.get("getObjectType");
    if (response2.data.status) {
      this.setState({
        objectTypeList: response2.data.data,
      });
    } else {
      message.error(`${response2.data.message}`);
    }
  };
  addObject = async () => {
    let response = await apiCall.post("addObject", {
      title: this.state.title,
      fields: this.state.fields,
      objectTypeId: this.state.objectTypeId,
    });
    if (response.data.status) {
      this.setState({
        title: "",
        fields: [""],
      });
      this.refreshAPi();
      message.success("Field Added");
    } else {
      message.error(`${response.data.message}`);
    }
  };
  editObject = async () => {
    var { activeSet } = this.state;
    activeSet.id = activeSet._id;
    let response = await apiCall.post("editObject", activeSet);
    if (response.data.status) {
      this.setState({
        activeSet: {},
        visible: false,
      });
      this.refreshAPi();
      message.success("Field Added");
    } else {
      message.error(`${response.data.message}`);
    }
  };
  setDefaultValue = () => {
    var { activeSet, fieldslist } = this.state;
    var defaultValue = [];
    for (let i = 0; i < activeSet.fields.length; i++) {
      defaultValue.push(
        fieldslist[fieldslist.findIndex((x) => String(x.title) === String(activeSet.fields[i].title))]._id
      );
    }
    activeSet.fields = defaultValue;
    activeSet.objectTypeId = activeSet.objectType[0] ? activeSet.objectType[0]._id : "";
    delete activeSet.objectType;
    this.setState({ activeSet, visible: true });
  };
  deleteItem = async (id) => {
    let response = await apiCall.get(`deleteObject/${id}`);
    if (response.data.status) {
      this.refreshAPi();
      message.success("Deleted");
    } else {
      message.error(response.data.message);
    }
  };
  render() {
    var pagination = {
      current: 1,
      pageSize: 1000,
    };
    var { activeSet, objectTypeList } = this.state;
    const columns = [
      {
        title: "Object Name",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Fields",
        key: "fields",
        render: (text, record) => (
          <React.Fragment>
            <ul>
              {record.fields.map((item) => {
                return <li>{item.title}</li>;
              })}
            </ul>
          </React.Fragment>
        ),
      },
      {
        title: "Object Type",
        key: "objectType",
        dataIndex: "objectType",
        render: (text, record) => <React.Fragment>{text[0] ? text[0].title : null}</React.Fragment>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <React.Fragment>
            <a
              href=""
              onClick={async (e) => {
                e.preventDefault();
                await this.setState({
                  activeSet: Object.assign({}, record),
                });
                this.setDefaultValue();
              }}
              style={{ marginRight: "10px" }}>
              Edit {record.name}
            </a>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                this.deleteItem(record._id);
              }}
              style={{ color: "darkred" }}>
              Delete
            </a>
          </React.Fragment>
        ),
      },
    ];
    console.log(this.state.activeSet);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"3"} />
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
              }}>
              <div className="site-layout-background" style={{ padding: 24, textAlign: "center" }}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="main-content">
                      <PageHeader className="site-page-header" onBack={null} title="Add Object" subTitle="" />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addObject();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              onChange={(e) =>
                                this.setState({
                                  title: e.target.value,
                                })
                              }
                              value={this.state.title}
                              required
                              placeholder="Title"
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              mode="multiple"
                              className="ant-d-form-fields"
                              onChange={(e) => {
                                this.setState({
                                  fields: e,
                                });
                              }}
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Fields"
                              optionFilterProp="children">
                              {this.state.fieldslist.map((item) => {
                                return <Option value={item._id}>{item.title}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <Select
                              className="ant-d-form-fields"
                              onChange={(e) => {
                                this.setState({
                                  objectTypeId: e,
                                });
                              }}
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Object Type"
                              optionFilterProp="children">
                              {objectTypeList.map((item) => {
                                return <Option value={item._id}>{item.title}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="ADD OBJECT" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table dataSource={this.state.objectslist} pagination={pagination} columns={columns} />
                    </div>
                  </div>
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
                className="w-100">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.editObject();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              onChange={(e) => {
                                activeSet.title = e.target.value;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              value={this.state.activeSet.title}
                              required
                              placeholder="Title"
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              mode="multiple"
                              value={this.state.activeSet.fields}
                              className="ant-d-form-fields"
                              onChange={(e) => {
                                activeSet.fields = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Fields"
                              optionFilterProp="children">
                              {this.state.fieldslist.map((item) => {
                                return <Option value={item._id}>{item.title}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <Select
                              className="ant-d-form-fields"
                              value={this.state.activeSet.objectTypeId}
                              onChange={(e) => {
                                activeSet.objectTypeId = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Object Type"
                              optionFilterProp="children">
                              {objectTypeList.map((item) => {
                                return <Option value={item._id}>{item.title}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="UPDATE OBJECT" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal>
            </Content>
            <Footer style={{ textAlign: "center" }}>Created by amarnathmodi ©2020</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
