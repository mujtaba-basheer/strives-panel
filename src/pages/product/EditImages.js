import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import { Layout, PageHeader, message, Divider, Spin } from "antd";
import apiCall from "../../utils/apiCall";

import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;

const upload = (file) => {
  const reader = new FileReader();
  return new Promise((res, rej) => {
    reader.addEventListener("load", (e) => {
      const base64 = e.target.result.split("base64,")[1];
      res(base64);
    });
    reader.addEventListener("error", (ev) => {
      console.error(ev.target.error);
      rej(new Error("Error Uploading File."));
    });
    reader.readAsDataURL(file);
  });
};

export default class editProductImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gallery: {
        main: [],
        small: [],
      },
      oldGallery: {},
      productId: "",
      productName: "",
      loading: true,
    };
  }

  componentDidMount = async () => {
    const product_id = window.location.pathname.split("/")[3];

    try {
      const { data: res } = await apiCall.get(`product/${product_id}`);

      this.setState({
        loading: false,
        gallery: res.data.gallery,
        oldGallery: res.data.gallery,
        productId: product_id,
        productName: res.data.name,
      });
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }
  };

  setMainGallery = async (e) => {
    const { files } = e.target;
    const gallery = Object.assign({}, this.state.gallery);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf(".")),
        name = file.name,
        mimeType = file.type;

      try {
        const data = await upload(file);

        gallery.main.push({
          name,
          data,
          extension,
          type: mimeType,
          src: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }

    this.setState({ gallery });
  };

  setSmallGallery = async (e) => {
    const { files } = e.target;
    const gallery = Object.assign({}, this.state.gallery);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf(".")),
        name = file.name,
        mimeType = file.type;

      try {
        const data = await upload(file);

        gallery.small.push({
          name,
          data,
          extension,
          type: mimeType,
          src: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }

    this.setState({ gallery });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { gallery, productId } = Object.assign({}, this.state);

    try {
      const res = await apiCall.put(`product-images/${productId}`, gallery);
      message.success(res.data.message);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }
    this.setState({ loading: false });
  };

  render() {
    const { gallery, loading, productName } = this.state;

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"5"} />
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
            <Spin spinning={loading} size="large">
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
                      title="Edit Product Images"
                      subTitle={productName}
                    />
                    <form
                      onSubmit={this.handleSubmit.bind(this)}
                      className="custom-form"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <label>Pictures (Big)</label>
                          <input
                            onChange={this.setMainGallery.bind(this)}
                            type="file"
                            accept="image/*"
                            placeholder="Images"
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginBottom: "1em",
                            justifyContent: "space-evenly",
                          }}
                          className="col-md-12"
                        >
                          {gallery.main.map(({ src }, index) => (
                            <div style={{ position: "relative" }} key={index}>
                              <img
                                style={{
                                  width: "auto",
                                  height: "200px",
                                }}
                                alt=""
                                src={src}
                              />
                              <div
                                onClick={() => {
                                  gallery.main.splice(index, 1);
                                  this.setState({ gallery });
                                }}
                                className="cross-btn"
                              >
                                x
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Divider />
                      <div className="row">
                        <div className="col-md-6">
                          <label>Pictures (Thumbnail)</label>
                          <input
                            onChange={this.setSmallGallery.bind(this)}
                            type="file"
                            accept="image/*"
                            placeholder="Images"
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginBottom: "1em",
                            justifyContent: "space-evenly",
                          }}
                          className="col-md-12"
                        >
                          {gallery.small.map(({ src }, index) => (
                            <div style={{ position: "relative" }} key={index}>
                              <img
                                style={{
                                  width: "auto",
                                  height: "200px",
                                }}
                                alt=""
                                src={src}
                              />
                              <div
                                onClick={() => {
                                  gallery.small.splice(index, 1);
                                  this.setState({ gallery });
                                }}
                                className="cross-btn"
                              >
                                x
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="submit"
                            className="form-button"
                            value="UPDATE IMAGES"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Content>
            </Spin>
            <Footer style={{ textAlign: "center" }}>
              Created by mujtaba-basheer ©2020
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
