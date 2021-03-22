/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import Sidebar from "../../common/sidebar";
import {
  Layout,
  Table,
  message,
  Popconfirm,
  PageHeader,
  Modal,
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

const booleanRender = (status = false) => (
  <span style={{ color: status ? "#1890ff" : "var(--danger)" }}>
    {status ? "Yes" : "No"}
  </span>
);

const blockRender = (isBlocked = false) => (
  <span style={{ color: isBlocked ? "var(--primary)" : "var(--danger)" }}>
    {isBlocked ? "Unblock" : "Block"}
  </span>
);

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default class productList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSet: [],
      visible: false,
      products: [],
      loading: false,
    };
  }

  refreshApi = async () => {
    this.setState({ loading: true });
    try {
      const res = await apiCall.get("products");
      this.setState({
        products: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
      this.setState({ loading: false });
    }
  };

  componentDidMount = () => {
    this.refreshApi();
  };

  deleteProduct = async (id) => {
    this.setState({ loading: true });
    try {
      const res = await apiCall.delete(`product/${id}`);
      message.success(res.data.message);
      this.refreshApi();
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
    this.setState({ loading: false });
  };

  blockUnblockProduct = async (id, status) => {
    this.setState({ loading: true });
    try {
      const res = await apiCall.put(`product/status/${id}`, { status });
      message.success(res.data.message);
      this.refreshApi();
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
    this.setState({ loading: false });
  };

  render() {
    let pagination = {
      current: 1,
      pageSize: 1000,
    };

    const { products, activeSet, visible, loading } = this.state;

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        fixed: "left",
      },
      // {
      //   title: "Short Description",
      //   dataIndex: "short_description",
      //   key: "short_description",
      //   width: 200,
      // },
      // {
      //   title: "Subtitle",
      //   dataIndex: "subtitle",
      //   key: "subtitle",
      //   width: 200,
      // },
      {
        title: "Gallery",
        dataIndex: "gallery",
        key: "gallery",
        render: (text, record, index) => (
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                activeSet: record.gallery.small,
                visible: true,
              });
            }}
            style={{ marginRight: "10px" }}
          >
            View Gallery
          </a>
        ),
        width: 200,
      },
      {
        title: "Available Sizes",
        dataIndex: "available_sizes",
        key: "available_sizes",
        render: (text) => (
          <ul>
            {text.map((val, index) => (
              <li key={index}>{val}</li>
            ))}
          </ul>
        ),
        width: 100,
      },
      {
        title: "MRP.",
        dataIndex: "mrp",
        key: "mrp",
        width: 100,
      },
      {
        title: "SP.",
        dataIndex: "sp",
        key: "sp",
        width: 100,
      },
      {
        title: "Free Shipping",
        dataIndex: "free_shipping",
        key: "free_shipping",
        render: (text) => booleanRender(text),
        width: 125,
      },
      // {
      //   title: "Details",
      //   dataIndex: "details",
      //   key: "details",
      //   render: (text) => (
      //     <ul>
      //       {text.map((val, index) => (
      //         <li key={index}>{val}</li>
      //       ))}
      //     </ul>
      //   ),
      //   width: 200,
      // },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width: 100,
      },
      {
        title: "Rating Count",
        dataIndex: "rating_count",
        key: "rating_count",
        width: 100,
      },
      {
        title: "Material",
        dataIndex: "materials",
        key: "materials",
        render: (text) => (
          <ul>
            {text.map((val, index) => (
              <li key={index}>{capitalize(val)}</li>
            ))}
          </ul>
        ),
        width: 100,
      },
      {
        title: "Colour",
        dataIndex: "colour",
        key: "colour",
        width: 100,
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (text) => text && text[0]["name"],
        width: 200,
      },
      {
        title: "Sub-Categories",
        dataIndex: "sub_categories",
        key: "sub_categories",
        render: (text) => (
          <table>
            {text.map(({ _id, name, value }) => (
              <tr key={_id}>
                <td style={{ border: "1px solid #000", padding: ".25em 1em" }}>
                  {name}
                </td>
                <td style={{ border: "1px solid #000", padding: ".25em 1em" }}>
                  {value}
                </td>
              </tr>
            ))}
          </table>
        ),
        width: 300,
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (text) =>
          text && (
            <ul>
              {text.map((val, index) => (
                <li key={index}>{val}</li>
              ))}
            </ul>
          ),
        width: 150,
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        width: 100,
      },
      {
        title: "Stocks Available",
        dataIndex: "stocks_available",
        key: "stocks_available",
        width: 100,
      },
      {
        title: "Blocked?",
        dataIndex: "isBlocked",
        key: "isBlocked",
        render: (text) => booleanRender(text),
        width: 100,
      },
      {
        title: "Date Added",
        dataIndex: "date",
        key: "date",
        render: (text) => {
          return new Date(text).toLocaleDateString();
        },
        width: 100,
      },
    ];

    columns.push({
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            title="Edit this product?"
            onConfirm={(e) => {
              e.preventDefault();
              this.props.history.push(`/product/edit/${record["_id"]}`);
            }}
            icon={<EditOutlined color="primary" />}
          >
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ marginRight: "10px" }}
            >
              Edit
            </a>
          </Popconfirm>
          <Popconfirm
            title={`${record.isBlocked ? "Unb" : "B"}lock this product?`}
            onConfirm={(e) => {
              e.preventDefault();
              this.blockUnblockProduct(
                record["_id"],
                record.isBlocked ? false : true
              );
            }}
            icon={<EditOutlined />}
          >
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ marginRight: "10px" }}
            >
              {blockRender(record.isBlocked)}
            </a>
          </Popconfirm>
          <Popconfirm
            title="Delete this product?"
            onConfirm={(e) => {
              e.preventDefault();
              this.deleteProduct(record["_id"]);
            }}
            icon={<DeleteOutlined style={{ color: "#dc3545" }} />}
          >
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ color: "#dc3545" }}
            >
              Delete
            </a>
          </Popconfirm>
        </Fragment>
      ),
      width: 180,
    });

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"11"} />
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
                    title="Products List"
                    subTitle=""
                  />
                  <Spin spinning={loading} size="large">
                    <Table
                      className="managerlisttable"
                      dataSource={products}
                      pagination={pagination}
                      columns={columns}
                      bordered
                      scroll={{ x: 1000, y: 1000 }}
                    />
                  </Spin>
                </div>
              </div>
              <Modal
                title="Product Gallery"
                visible={visible}
                onCancel={(e) => {
                  this.setState({
                    visible: false,
                    activeSet: [],
                  });
                }}
                footer={null}
                width={1500}
              >
                <div className="row">
                  <div className="col-md-12">
                    <div style={{ display: "flex" }} className="main-content">
                      {activeSet.map((item) => (
                        <div key={item.details["ETag"]}>
                          <img
                            style={{ width: "100%" }}
                            loading="lazy"
                            alt=""
                            src={item.src}
                          />
                        </div>
                      ))}
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
