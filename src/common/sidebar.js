import React, { Component } from "react";
import { Divider, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { getUser } from "../utils/store";

import "antd/dist/antd.css";
const { Sider } = Layout;

export default class sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userType: "",
      },
    };
  }

  componentDidMount = () => {
    let user = getUser();
    if (user) {
      this.setState({ user: user });
    }
  };

  logout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("userDetails");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  render() {
    return (
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div className="logo" style={{ height: "60px" }} />
        <img
          src="/close.png"
          alt=""
          className="d-block d-md-none"
          onClick={(e) => {
            document.body.classList.toggle("isClosed");
          }}
          style={{
            cursor: "pointer",
            width: "15px",
            marginLeft: "20px",
            position: "absolute",
            right: "15px",
            top: "25px",
          }}
        />

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[this.props.activeNo]}
        >
          <Menu.Item key="1" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/tags"
            >
              Tags
            </Link>
          </Menu.Item>
          <Menu.Item key="2" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/sub-categories"
            >
              Sub-Categories
            </Link>
          </Menu.Item>
          <Menu.Item key="3" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/add-category"
            >
              Add Category
            </Link>
          </Menu.Item>
          <Menu.Item key="4" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/colours"
            >
              Colours
            </Link>
          </Menu.Item>
          <Menu.Item key="5" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/add-product"
            >
              Add Product
            </Link>
          </Menu.Item>
          <Menu.Item key="6" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/product/list-category"
            >
              Categories List
            </Link>
          </Menu.Item>
          <Divider />
          <Menu.Item key="8" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/orders/list"
            >
              Orders List
            </Link>
          </Menu.Item>
          <Divider />
          <Menu.Item key="7" icon="true">
            <Link
              onClick={(e) => {
                document.body.classList.toggle("isClosed");
              }}
              to="/assets/images"
            >
              Images
            </Link>
          </Menu.Item>
          <Divider />
          <Menu.Item key="9" icon="true">
            <Link
              onClick={(e) => {
                this.logout(e);
              }}
              to="/login"
            >
              Logout
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
