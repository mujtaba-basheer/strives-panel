/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, Table, PageHeader, Select, message, Modal } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
message.config({
  maxCount: 1,
});
export default class addFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "Select Type",
      fieldslist: [],
      visible: false,
      activeSet: {},
    };
  }
  refreshAPi = async () => {
    let response = await apiCall.get("getField");
    if (response.data.status) {
      this.setState({
        fieldslist: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };
  componentDidMount = () => {
    this.refreshAPi();
  };
  addField = async () => {
    let response = await apiCall.post("addField", {
      title: this.state.title,
      type: this.state.type,
    });
    if (response.data.status) {
      this.setState({
        title: "",
        type: "Select Type",
      });
      this.refreshAPi();
      message.success("Field Added");
    } else {
      message.error(`${response.data.message}`);
    }
  };
  editField = async () => {
    var { activeSet } = this.state;
    activeSet.id = activeSet._id;
    let response = await apiCall.post("editField", activeSet);
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
  deleteItem = async (id) => {
    let response = await apiCall.get(`deleteField/${id}`);
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
    var { activeSet } = this.state;
    console.log(this.state);
    const columns2 = [
      {
        title: "Field Name",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
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
                  visible: true,
                });
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
    console.log(this.state);
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"12"} />
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
                <div className="row">
                  <div className="col-md-4">
                    <div className="main-content">
                      <PageHeader className="site-page-header" onBack={null} title="Add Field" subTitle="" />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addField();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              value={this.state.title}
                              onChange={(e) => this.setState({ title: e.target.value })}
                              placeholder="Field Name"
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              onChange={(e) => this.setState({ type: e })}
                              value={this.state.type}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{ width: 200 }}
                              placeholder="Select Field Type"
                              optionFilterProp="children">
                              <Option value="Alpha-numeric">Alpha-numeric</Option>
                              <Option value="Numeric">Numeric</Option>
                              <Option value="Date">Date</Option>
                              <Option value="Time">Time</Option>
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="ADD FIELD" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table dataSource={this.state.fieldslist} pagination={pagination} columns={columns2} />
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                title="Edit"
                visible={this.state.visible}
                onCancel={(e) => {
                  this.setState({ visible: false, activeSet: {} });
                }}
                footer={null}
                style={{ width: "100%!important", maxWidth: "600px" }}
                className="w-100">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.editField();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              value={this.state.activeSet.title}
                              onChange={(e) => {
                                activeSet.title = e.target.value;
                                this.setState({ activeSet });
                              }}
                              placeholder="Field Name"
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              onChange={(e) => {
                                activeSet.type = e;
                                this.setState({ activeSet });
                              }}
                              value={this.state.activeSet.type}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{ width: 200 }}
                              placeholder="Select Field Type"
                              optionFilterProp="children">
                              <Option value="Alpha-numeric">Alpha-numeric</Option>
                              <Option value="Numeric">Numeric</Option>
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="UPDATE FIELD" />
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
