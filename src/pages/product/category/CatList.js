/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../../common/sidebar";
import { Layout, Table, message, Popconfirm } from "antd";
import { EditOutlined } from "@ant-design/icons";
import apiCall from "../../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

export default class listCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSet: {},
      visible: false,
      category_list: [],
      sub_categories: [],
    };
  }

  refreshApi = async () => {
    try {
      const res0 = apiCall.get("categories");
      const res1 = apiCall.get("sub-categories");

      const [{ data: data0 }, { data: data1 }] = await Promise.all([
        res0,
        res1,
      ]);
      this.setState({
        category_list: data0.data,
        sub_categories: data1.data,
      });
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

    const { category_list, sub_categories } = this.state;

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        fixed: "left",
      },
      {
        title: "Description",
        dataIndex: "desc",
        key: "desc",
        width: 200,
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
    ];

    for (let subCat of sub_categories) {
      columns.push({
        title: subCat.name,
        key: subCat["_id"],
        render: (text, record) => {
          const searchIndex = record.sub_categories.findIndex(
            ({ slug_name }) => slug_name === subCat.slug_name
          );
          if (searchIndex !== -1)
            return (
              <ul>
                {record.sub_categories[searchIndex].values.map((val, index) => (
                  <li key={index}>{val}</li>
                ))}
              </ul>
            );
          else return <span>No Data</span>;
        },
        width: 175,
      });
    }

    columns.push({
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Edit this category?"
          onConfirm={(e) => {
            e.preventDefault();
            this.props.history.push(`/product/edit-category/${record["_id"]}`);
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
      ),
      width: 75,
    });

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"6"} />
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
                  <Table
                    className="managerlisttable"
                    dataSource={category_list}
                    pagination={pagination}
                    columns={columns}
                    bordered
                    scroll={{ x: 1000, y: 1000 }}
                  />
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
