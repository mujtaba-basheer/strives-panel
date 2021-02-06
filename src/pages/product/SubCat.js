/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import {
  Layout,
  Table,
  PageHeader,
  message,
  Modal,
  Popconfirm,
  Button,
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
message.config({
  maxCount: 1,
});

export default class SubCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: "Select Type",
      sclist: [],
      values: [
        {
          sl_no: 0,
          value: "",
        },
      ],
      visible: false,
      activeSet: { name: "", values: [] },
      tag: "",
      currentList: [],
      displayList: false,
      displayEdit: false,
    };
  }

  refreshAPi = async () => {
    try {
      let response = await apiCall.get("sub-categories");
      if (response.data.status) {
        this.setState({
          sclist: response.data.data,
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

  addSubCat = async () => {
    let { name, values } = this.state;
    values = values.map(({ value }) => value);
    try {
      const resp = await apiCall.post("sub-category", { name, values });
      message.success(resp.data.message);
      this.setState({ name: "", values: [{ sl_no: 0, value: "" }] });
      this.refreshAPi();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  updateSubCat = async (id) => {
    let { name, values } = this.state.activeSet;
    values = values.map(({ value }) => value);
    try {
      const resp = await apiCall.put(`sub-category/${id}`, { name, values });
      message.success(resp.data.message);
      this.setState({
        activeSet: { name: "", values: [] },
        displayEdit: false,
      });
      this.refreshAPi();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  addValue = () => {
    let values = [...this.state.values];
    values.push({ sl_no: values.length, value: "" });
    this.setState({ values });
  };

  deleteValue = (index) => {
    console.log(index);
    let values = [...this.state.values];
    values.splice(index, 1);
    this.setState({
      values: values.map((el, index) => {
        return { ...el, sl_no: index };
      }),
    });
  };

  addValueEdit = () => {
    let values = [...this.state.activeSet.values];
    values.push({ sl_no: values.length, value: "" });
    this.setState({ activeSet: { ...this.state.activeSet, values } });
  };

  deleteValueEdit = (index) => {
    console.log(index);
    let values = [...this.state.activeSet.values];
    values.splice(index, 1);
    this.setState({
      activeSet: {
        ...this.state.activeSet,
        values: values.map((el, index) => {
          return { ...el, sl_no: index };
        }),
      },
    });
  };

  deleteSubCat = async (id) => {
    try {
      let response = await apiCall.delete(`sub-category/${id}`);
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
    const {
      activeSet,
      values,
      name,
      sclist,
      currentList,
      displayList,
      displayEdit,
    } = this.state;
    console.log(this.state);

    const columns = [
      {
        title: "Sl. No.",
        key: "sl_no",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Sub-Category Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Values",
        dataIndex: "values",
        key: "values",
        render: (text, record, index) => (
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              const { name, values, _id: id } = record;
              this.setState({
                currentList: text,
                displayList: true,
                activeSet: {
                  id,
                  name,
                  values: values.map((val, index) => {
                    return { value: val, sl_no: index };
                  }),
                },
              });
            }}
            style={{ marginRight: "10px" }}
          >
            View List
          </a>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Popconfirm
            title="Delete this sub-category?"
            onConfirm={(e) => {
              e.preventDefault();
              this.deleteSubCat(record._id);
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

    const list_columns = [
      {
        title: "Sl. No",
        key: "sl_no",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Title",
        key: "title",
        render: (text, record, index) => text,
      },
    ];

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"2"} />
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
                        title="Add Sub-Category"
                        subTitle=""
                      />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addSubCat();
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
                              placeholder="Sub-Category Name"
                              required
                            />
                          </div>
                          {values.map(({ sl_no, value }) => (
                            <div key={sl_no} className="col-md-12 table-input">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  values[sl_no]["value"] = val;
                                  this.setState({ values });
                                }}
                                placeholder={`Value ${sl_no + 1}`}
                                required
                              />
                              <button
                                disabled={values.length === 1}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.deleteValue(sl_no);
                                }}
                              >
                                <DeleteOutlined />
                              </button>
                            </div>
                          ))}
                          <div className="col-md-12 table-add">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                this.addValue();
                              }}
                            >
                              <PlusCircleOutlined /> ADD VALUE
                            </button>
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="ADD SUB-CATEGORY"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table
                        dataSource={sclist}
                        pagination={pagination}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                title="Values List"
                visible={displayList}
                onCancel={(e) => {
                  this.setState({
                    displayList: false,
                    currentList: [],
                  });
                }}
                footer={[
                  <Button
                    key="back"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({
                        displayList: false,
                        currentList: [],
                      });
                    }}
                  >
                    Cancel
                  </Button>,
                  <Button
                    type="primary"
                    key="edit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({
                        displayEdit: true,
                        displayList: false,
                        currentList: [],
                      });
                    }}
                  >
                    Edit
                  </Button>,
                ]}
                style={{
                  width: "100%!important",
                  maxWidth: "600px",
                }}
                className="w-100"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <Table
                        className="userlisttable"
                        dataSource={currentList}
                        pagination={false}
                        columns={list_columns}
                        bordered
                      />
                    </div>
                  </div>
                </div>
              </Modal>
              <Modal
                title="Edit Sub-Category"
                visible={displayEdit}
                onCancel={(e) => {
                  e.preventDefault();
                  this.setState({
                    displayEdit: false,
                    activeSet: { name: "", values: [] },
                  });
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
                          this.updateSubCat(activeSet["id"]);
                        }}
                        className="custom-form"
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              value={activeSet.name}
                              onChange={(e) => {
                                e.preventDefault();
                                activeSet.name = e.target.value;
                                this.setState({ activeSet });
                              }}
                              placeholder="Sub-Category Name"
                              required
                            />
                          </div>
                          {activeSet.values.map(({ sl_no, value }) => (
                            <div key={sl_no} className="col-md-12 table-input">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  activeSet.values[sl_no]["value"] = val;
                                  this.setState({ activeSet });
                                }}
                                placeholder={`Value ${sl_no + 1}`}
                                required
                              />
                              <button
                                disabled={activeSet.values.length === 1}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.deleteValueEdit(sl_no);
                                }}
                              >
                                <DeleteOutlined />
                              </button>
                            </div>
                          ))}
                          <div className="col-md-12 table-add">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                this.addValueEdit();
                              }}
                            >
                              <PlusCircleOutlined /> ADD VALUE
                            </button>
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="UPDATE SUB-CATEGORY"
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
