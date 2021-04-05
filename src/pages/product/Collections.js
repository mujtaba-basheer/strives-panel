/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import { Layout, Table, PageHeader, message, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
message.config({
  maxCount: 1,
});

export default class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      visible: false,
      activeSet: {},
      name: "",
    };
  }

  refreshAPi = async () => {
    try {
      let response = await apiCall.get("collections");
      if (response.data.status) {
        this.setState({
          collections: response.data.data,
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

  addCollection = async () => {
    try {
      let response = await apiCall.post("collection", {
        name: this.state.name,
      });
      if (response.data.status) {
        this.setState({
          name: "",
        });
        this.refreshAPi();
        message.success(response.data.message);
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error(error.message);
      message.error(error.response.data.message);
    }
  };

  deleteCollection = async (id) => {
    try {
      let response = await apiCall.delete(`collection/${id}`);
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
    var pagination = {
      current: 1,
      pageSize: 1000,
    };
    const columns = [
      {
        title: "Sl. No.",
        key: "sl_no",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Collection Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Popconfirm
            title="Delete this collection?"
            onConfirm={(e) => {
              e.preventDefault();
              this.deleteCollection(record._id);
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

    const { name, collections } = this.state;

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
                        title="Add Collection"
                        subTitle=""
                      />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addCollection();
                        }}
                        className="custom-form"
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) =>
                                this.setState({ name: e.target.value })
                              }
                              placeholder="Collection Name"
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="ADD COLLECTION"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table
                        dataSource={collections}
                        pagination={pagination}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Created by mujtaba-basheer ©2021
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
