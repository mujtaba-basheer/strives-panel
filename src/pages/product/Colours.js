/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import {
  Layout,
  Table,
  PageHeader,
  Select,
  message,
  Modal,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
message.config({
  maxCount: 1,
});

export default class Colours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "Select Type",
      colourslist: [],
      visible: false,
      activeSet: {},
      full_name: "",
      common_name: "",
      hexcode: "",
    };
  }

  refreshAPi = async () => {
    try {
      let response = await apiCall.get("colours");
      if (response.data.status) {
        this.setState({
          colourslist: response.data.data,
        });
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  componentDidMount = () => {
    this.refreshAPi();
  };

  addColour = async () => {
    try {
      const { full_name, common_name, hexcode } = this.state;
      let response = await apiCall.post("colour", {
        full_name,
        common_name,
        hexcode,
      });
      if (response.data.status) {
        message.success(response.data.message);
        this.setState({
          full_name: "",
          common_name: "",
          hexcode: "",
        });
        this.refreshAPi();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error(error.message);
      message.error(error.response.data.message);
    }
  };

  deleteColour = async (id) => {
    try {
      let response = await apiCall.delete(`colour/${id}`);
      console.log(response);
      if (response.data.status) {
        message.success(response.data.message);
        this.refreshAPi();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  render() {
    const pagination = {
      current: 1,
      pageSize: 1000,
    };
    const {
      activeSet,
      colourslist,
      full_name,
      common_name,
      hexcode,
    } = this.state;
    console.log(this.state);
    const columns = [
      {
        title: "Sl. No.",
        key: "sl_no",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Colour Name",
        dataIndex: "full_name",
        key: "full_name",
      },
      {
        title: "Common Name",
        dataIndex: "common_name",
        key: "common_name",
      },
      {
        title: "Hexcode",
        dataIndex: "hexcode",
        key: "hexcode",
      },
      {
        title: "Display Colour",
        key: "display",
        render: (text, record) => (
          <div
            style={{
              background: `#${record.hexcode}`,
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              marginLeft: "35px",
            }}
          ></div>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Popconfirm
            title="Delete this tag"
            onConfirm={(e) => {
              e.preventDefault();
              this.deleteColour(record._id);
            }}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
          >
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ color: "darkred" }}
            >
              Delete
            </a>
          </Popconfirm>
        ),
      },
    ];

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
                alt=""
                src="/menu.png"
                style={{ cursor: "pointer", width: "20px", marginLeft: "20px" }}
                onClick={(e) => {
                  document.body.classList.toggle("isClosed");
                }}
              />
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, textAlign: "center" }}
              >
                <div className="row">
                  <div className="col-md-4">
                    <div className="main-content">
                      <PageHeader
                        className="site-page-header"
                        onBack={null}
                        title="Add Colour"
                        subTitle=""
                      />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addColour();
                        }}
                        className="custom-form"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              type="text"
                              value={full_name}
                              onChange={(e) =>
                                this.setState({ full_name: e.target.value })
                              }
                              placeholder="Full Colour Name"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              value={common_name}
                              onChange={(e) =>
                                this.setState({ common_name: e.target.value })
                              }
                              placeholder="Common Name"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              value={hexcode}
                              onChange={(e) =>
                                this.setState({ hexcode: e.target.value })
                              }
                              placeholder="Hexcode (without #)"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <div
                              style={{
                                background: `#${hexcode}`,
                                marginBottom: "15px",
                                height: "calc(100% - 15px)",
                                border: "1px solid gray",
                                borderRadius: "3px",
                              }}
                            ></div>
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="ADD COLOUR"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table
                        dataSource={colourslist}
                        pagination={pagination}
                        columns={columns}
                      />
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
                className="w-100"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.editField();
                        }}
                        className="custom-form"
                      >
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
                              optionFilterProp="children"
                            >
                              <Option value="Alpha-numeric">
                                Alpha-numeric
                              </Option>
                              <Option value="Numeric">Numeric</Option>
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="UPDATE FIELD"
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
