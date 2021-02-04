/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-loop-func */
import React, { Component } from "react";
import Sidebar from "../common/sidebar";
import { Layout, Table, PageHeader, Select, message, Modal } from "antd";
import apiCall from "../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option, OptGroup } = Select;

export default class company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      companyType: null,
      fields: [],
      fieldslist: [],
      objectslist: [],
      visible: false,
      activeSet: {},
      companyTypeList: [],
      comapnyList: [],
    };
  }
  refreshAPi = async () => {
    let response = await apiCall.get("getComapnyList");
    if (response.data.status) {
      console.log(response);
      this.setState({
        comapnyList: response.data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };

  componentDidMount = async () => {
    this.refreshAPi();
  };

  addCompany = async () => {
    let response = await apiCall.post("addCompany", {
      name: this.state.name,
      companyType: this.state.companyType,
    });
    if (response.data.status) {
      this.setState({
        name: "",
        companyType: "",
      });
      this.refreshAPi();
      message.success("Company Added");
    } else {
      message.error(`${response.data.message}`);
    }
  };

  editCompany = async () => {
    let { activeSet } = this.state;

    try {
      await apiCall.post("editCompany", activeSet);
      this.setState({
        activeSet: {},
        visible: false,
      });
      this.refreshAPi();
      message.success("Comapny Details Updated.");
    } catch (error) {
      console.log(error.response.error);
      message.error(error.response.data.message);
    }
  };

  deleteItem = async (id) => {
    let response = await apiCall.delete(`deleteCompany/${id}`);
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
    const columns = [
      {
        title: "Company Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Company Type",
        key: "companyType",
        dataIndex: "companyType",
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
                this.setState({
                  activeSet: Object.assign({}, record),
                  visible: true,
                });
              }}
              style={{ marginRight: "10px" }}>
              Edit
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
    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"15"} />
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
              }}>
              <div className="site-layout-background" style={{ padding: 24, textAlign: "center" }}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="main-content">
                      <PageHeader className="site-page-header" onBack={null} title="Add Company" subTitle="" />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.addCompany();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              onChange={(e) =>
                                this.setState({
                                  name: e.target.value,
                                })
                              }
                              value={this.state.name}
                              required
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              mode="single"
                              onChange={(e) =>
                                this.setState({
                                  companyType: e,
                                })
                              }
                              allowClear={true}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Type"
                              optionFilterProp="children">
                              <OptGroup label="Employee">
                                <Option value="Admin">Admin</Option>
                                <Option value="Accounts">Accounts</Option>
                                <Option value="Production">Production</Option>
                                <Option value="Sales">Sales</Option>
                              </OptGroup>
                              <OptGroup label="Customer">
                                <Option value="Distributor">Distributor</Option>
                                <Option value="Super">Super</Option>
                                <Option value="Sub Party">Sub Party</Option>
                                <Option value="Wholeseller">Wholeseller</Option>
                                <Option value="Retailer">Retailer</Option>
                                <Option value="Pan Shop">Pan Shop</Option>
                                <Option value="Sweet Shop">Sweet Shop</Option>
                                <Option value="Institution Sales">Institution Sales</Option>
                              </OptGroup>
                              <OptGroup label="Vendor">
                                <Option value="Vendor">Vendor</Option>
                              </OptGroup>
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="ADD COMPANY" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table dataSource={this.state.comapnyList} pagination={pagination} columns={columns} />
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
                          this.editCompany();
                        }}
                        className="custom-form">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="text"
                              onChange={(e) => {
                                activeSet.name = e.target.value;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              value={this.state.activeSet.name}
                              required
                              placeholder="Name"
                            />
                          </div>
                          <div className="col-md-12">
                            <Select
                              className="ant-d-form-fields"
                              value={this.state.activeSet.companyType}
                              onChange={(e) => {
                                activeSet.companyType = e;
                                this.setState({
                                  activeSet,
                                });
                              }}
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Select Company Type"
                              optionFilterProp="children">
                              <OptGroup label="Employee">
                                <Option value="Admin">Admin</Option>
                                <Option value="Accounts">Accounts</Option>
                                <Option value="Production">Production</Option>
                                <Option value="Sales">Sales</Option>
                              </OptGroup>
                              <OptGroup label="Customer">
                                <Option value="Distributor">Distributor</Option>
                                <Option value="Super">Super</Option>
                                <Option value="Sub Party">Sub Party</Option>
                                <Option value="Wholeseller">Wholeseller</Option>
                                <Option value="Retailer">Retailer</Option>
                                <Option value="Pan Shop">Pan Shop</Option>
                                <Option value="Sweet Shop">Sweet Shop</Option>
                                <Option value="Institution Sales">Institution Sales</Option>
                              </OptGroup>
                              <OptGroup label="Vendor">
                                <Option value="Vendor">Vendor</Option>
                              </OptGroup>
                            </Select>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="form-button" value="UPDATE COMPANY" />
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
