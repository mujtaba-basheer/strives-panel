/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import { Layout, Table, PageHeader, message, Popconfirm, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
message.config({
  maxCount: 1,
});

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      images: [],
      url: "",
    };
  }

  refreshAPi = async () => {
    document.getElementById("file-input").value = null;

    try {
      let response = await apiCall.get("images");
      if (response.data.status) {
        this.setState({
          images: response.data.data,
          file: {},
          url: "",
        });
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  upload = (file) => {
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

  componentDidMount = () => {
    this.refreshAPi();
  };

  uploadImage = async () => {
    try {
      const { file } = this.state;
      let response = await apiCall.post("image", file);
      if (response.data.status) {
        this.refreshAPi();
        message.success(response.data.message);
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(response.data.data);
            message.success("Image Link Copied to Clipboard.");
          } catch (error) {
            message.error(error.message);
          }
        }
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error(error.message);
      message.error(error.response.data.message);
    }
  };

  deleteImage = async (id) => {
    try {
      const res = await apiCall.delete(`image/${id}`);
      message.success(res.data.message);
      this.refreshAPi();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  handleImage = async (e) => {
    const fileEl = document.getElementById("file-input");
    const file = fileEl.files[0];
    console.log(file);
    const size = file.size,
      extension = file.name.substring(file.name.lastIndexOf(".")),
      mimeType = file.type,
      url = window.URL.createObjectURL(file);

    try {
      const data = await this.upload(file);

      this.setState({
        file: {
          size,
          extension,
          mimeType,
          base64: data,
        },
        url,
      });
    } catch (error) {
      console.error(error);
      message.error("Error reading image");
    }
  };

  render() {
    var pagination = {
      current: 1,
      pageSize: 1000,
    };

    const { url, images } = this.state;

    const columns = [
      {
        title: "Links",
        key: "sl_no",
        render: (text, record, index) => (
          <Tooltip trigger="click" title={"Link Copied"}>
            <a
              href=""
              onClick={async (e) => {
                e.preventDefault();
                try {
                  if (navigator.clipboard) {
                    await navigator.clipboard.writeText(record["src"]);
                  } else throw new Error("Copy link not supported");
                } catch (error) {
                  message.error(error.message);
                }
              }}
            >
              Copy Link
            </a>
          </Tooltip>
        ),
      },
      {
        title: "Image",
        dataIndex: "src",
        key: "src",
        render: (text) => (
          <img
            alt="img"
            src={text}
            loading="lazy"
            style={{ width: "450px", height: "auto" }}
          />
        ),
      },
      {
        title: "Size",
        key: "size",
        render: (text, record) =>
          `${(record.details.size / (1024 * 1024)).toFixed(2)} MB`,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Popconfirm
            title="Delete this image?"
            onConfirm={(e) => {
              e.preventDefault();
              this.deleteImage(record._id);
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
          <Sidebar activeNo={"7"} />
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
                        title="Images"
                        subTitle=""
                      />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.uploadImage();
                        }}
                        className="custom-form"
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <label>Upload Image</label>
                            <input
                              type="file"
                              onChange={this.handleImage}
                              id="file-input"
                              placeholder="Upload File"
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <div className="img-container">
                              <img
                                style={{ width: "100%", height: "auto" }}
                                alt="Preview"
                                src={url}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="form-button"
                              value="UPLOAD IMAGE"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="main-content">
                      <Table
                        dataSource={images}
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
