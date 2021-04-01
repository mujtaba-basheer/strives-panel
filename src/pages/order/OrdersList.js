/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import { Layout, Table, message, PageHeader, Modal, Spin } from "antd";
// import { EditOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

const status_options = [
  { status: "on-hold", display: "On Hold" },
  { status: "confirmed", display: "Confirmed" },
  { status: "rejected", display: "Rejected" },
  { status: "in-transit", display: "In Transit" },
  { status: "pending", display: "Pending" },
  { status: "scheduled", display: "Scheduled" },
  { status: "dispatched", display: "Dispatched" },
  { status: "delivered", display: "Delivered" },
  { status: "cancelled", display: "Cancelled" },
  { status: "rto", display: "Return to Origin" },
  { status: "dto", display: "Deliver to Origin" },
  { status: "collected", display: "Collected" },
];

export default class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSet: {},
      showItems: false,
      orders: [],
      items: [],
      address: [],
      showAddress: false,
      loading: true,
    };
  }

  refreshApi = async () => {
    this.setState({ loading: true });
    try {
      const { data } = await apiCall.get("orders");

      this.setState({ orders: data.data });
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }

    this.setState({ loading: false });
  };

  updateStatus = async (status, id) => {
    try {
      const resp = await apiCall.put(`order/status/${id}`, { status });
      message.success(resp.data.message);
      this.refreshApi();
    } catch (error) {
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

    const {
      orders,
      showItems,
      items,
      address,
      showAddress,
      loading,
    } = this.state;

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
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text) => (
          <a
            onClick={(e) => {
              e.preventDefault();

              this.setState({
                address: [text],
                showAddress: true,
              });
            }}
            href="#"
          >
            View Address
          </a>
        ),
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
                showItems: true,
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
        render: (text = "", record) => (
          <select
            value={text}
            onChange={(e) => {
              const new_status = e.target.value;
              if (new_status === "rejected") {
                const confirmReject = window.confirm("Reject this order?");
                if (confirmReject)
                  this.updateStatus(e.target.value, record["_id"]);
              } else this.updateStatus(e.target.value, record["_id"]);
            }}
          >
            {status_options.map(({ status, display }) => (
              <option key={status} value={status}>
                {display}
              </option>
            ))}
          </select>
        ),
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
      {
        title: "Custom Size",
        dataIndex: "custom",
        key: "custom",
        render: (text) => {
          if (!text) return "NA";
          else {
            const customSize = Object.keys(text).map((key) => ({
              field: key,
              size: text[key],
            }));

            return (
              <ul>
                {customSize.map(({ field, size }, index) => (
                  <li key={field}>
                    {field.toUpperCase()}: {size} in.
                  </li>
                ))}
              </ul>
            );
          }
        },
      },
    ];

    const address_columns = [
      {
        title: "Address 1",
        dataIndex: "address1",
        key: "address1",
        width: 600,
      },
      {
        title: "Address 2",
        dataIndex: "address2",
        key: "address2",
      },
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "Landmark",
        dataIndex: "landmark",
        key: "landmark",
      },
      {
        title: "Pincode",
        dataIndex: "pincode",
        key: "pincode",
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
                  <Spin size="large" spinning={loading}>
                    <Table
                      className="managerlisttable"
                      dataSource={orders}
                      pagination={pagination}
                      columns={columns}
                      bordered
                      scroll={{ x: 1000, y: 1000 }}
                    />
                  </Spin>
                </div>
              </div>
              <Modal
                title="Items List"
                visible={showItems}
                onCancel={(e) => {
                  e.preventDefault();
                  this.setState({
                    showItems: false,
                    items: [],
                  });
                }}
                footer={null}
                style={{ width: "100%!important", maxWidth: "750px" }}
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
              <Modal
                title="User's Address"
                visible={showAddress}
                onCancel={(e) => {
                  e.preventDefault();
                  this.setState({
                    showAddress: false,
                    address: [],
                  });
                }}
                footer={null}
                style={{ width: "100%!important", maxWidth: "1400px" }}
                className="w-100"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-content">
                      <Table
                        className="userlisttable"
                        dataSource={address}
                        pagination={false}
                        columns={address_columns}
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
