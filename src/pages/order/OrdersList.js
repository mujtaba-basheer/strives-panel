/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import { Layout, Table, message, PageHeader, Modal } from "antd";
// import { EditOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

export default class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSet: {},
      visible: false,
      orders: [],
      items: [],
    };
  }

  refreshApi = async () => {
    try {
      const { data } = await apiCall.get("orders");

      this.setState({ orders: data.data });
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  componentDidMount = () => {
    this.refreshApi();
  };

  render() {
    let pagination = {
      current: 1,
      pageSize: 1000,
    };

    const { orders, visible, items } = this.state;

    const columns = [
      {
        title: "Date",
        dataIndex: "time",
        key: "time",
        render: (text) => {
          const dateObj = new Date(text);
          const timeStr = dateObj.toLocaleTimeString(),
            dateStr = dateObj.toLocaleDateString();
          return `${dateStr}, ${timeStr}`;
        },
      },
      {
        title: "Amount (₹)",
        dataIndex: "totalSP",
        key: "totalSP",
      },
      {
        title: "Items",
        dataIndex: "items",
        key: "items",
        render: (text) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                items: text,
                visible: true,
              });
            }}
            href="#"
          >
            View List
          </a>
        ),
      },
      {
        title: "Location",
        dataIndex: "address",
        key: "address",
        render: ({ city, state }) => `${city}, ${state}`,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text = "") => {
          const firstChar = text.charAt(0).toUpperCase();
          const restOfStr = text.substring(1);
          return firstChar + restOfStr;
        },
      },
      {
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (text) => text.toUpperCase(),
      },
      {
        title: "Delivered On",
        dataIndex: "deliveredOn",
        key: "deliveredOn",
        render: (text) => {
          if (!text) return "NA";

          const dateObj = new Date(text);
          const timeStr = dateObj.toLocaleTimeString(),
            dateStr = dateObj.toLocaleDateString();
          return `${dateStr} ${timeStr}`;
        },
      },
    ];

    const items_columns = [
      {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Selling Price (₹)",
        dataIndex: "sp",
        key: "sp",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        render: (text) => text && text.toUpperCase(),
      },
    ];

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"8"} />
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
                  <PageHeader
                    className="site-page-header"
                    onBack={null}
                    title="Orders List"
                  />
                  <Table
                    className="managerlisttable"
                    dataSource={orders}
                    pagination={pagination}
                    columns={columns}
                    bordered
                    scroll={{ x: 1000, y: 1000 }}
                  />
                </div>
              </div>
              <Modal
                title="Items List"
                visible={visible}
                onCancel={(e) => {
                  e.preventDefault();
                  this.setState({
                    visible: false,
                    items: [],
                  });
                }}
                footer={null}
                style={{ width: "100%!important", maxWidth: "600px" }}
                className="w-100"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <Table
                        className="userlisttable"
                        dataSource={items}
                        pagination={false}
                        columns={items_columns}
                        bordered
                      />
                    </div>
                  </div>
                </div>
              </Modal>
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
