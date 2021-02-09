import React, { Component } from "react";
import Sidebar from "../../../common/sidebar";
import { Layout, PageHeader, message, Select, Divider } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import apiCall from "../../../utils/apiCall";
import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;

export default class addCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_cat_list: [],
      tags_list: [],
      sub_categories: [{ values: [], selected: [] }],
      tags: [],
      name: "",
      desc: "",
      category_id: "",
    };
  }

  componentDidMount = async () => {
    const category_id = this.props.location.pathname.split("/")[3];

    try {
      let resp = await apiCall.get(`category/${category_id}`);
      const { desc, tags, name, sub_categories } = resp.data.data;
      this.setState({
        desc,
        tags,
        name,
        sub_categories: sub_categories.map((item) => ({
          ...item,
          selected: item.values,
        })),
        category_id,
      });
    } catch (error) {}
    let response = apiCall.get("sub-categories");
    let response1 = apiCall.get("tags");
    let data = await Promise.all([response, response1]);
    if (data[0].data.status) {
      const sub_cat_arr = [...this.state.sub_categories];
      sub_cat_arr.forEach((subCat) => {
        const sub_cat = data[0].data.data.find(
          (item) => item["_id"] === subCat["_id"]
        );
        subCat.values = sub_cat.values;
        return subCat;
      });
      this.setState({
        sub_cat_list: data[0].data.data,
        sub_categories: sub_cat_arr,
      });
    } else {
      message.error(`${response.data.message}`);
    }
    if (data[1].data.status) {
      this.setState({
        tags_list: data[1].data.data,
      });
    } else {
      message.error(`${response.data.message}`);
    }
  };

  // sub-category handlers

  addSubCat = () => {
    const values = [...this.state.sub_categories];
    values.push({ values: [] });
    this.setState({ sub_categories: values });
  };

  deleteSubCat = (index) => {
    const values = [...this.state.sub_categories];
    values.splice(index, 1);
    this.setState({ sub_categories: values });
  };

  handleSelectSubCat = (index, selected) => {
    const values = [...this.state.sub_categories];
    const sub_cat = this.state.sub_cat_list.find(
      ({ _id: id }) => id === selected
    );
    values[index] = sub_cat;
    this.setState({ sub_categories: values });
  };

  handleValuesChange = (index, values_list) => {
    const values = [...this.state.sub_categories];
    values[index]["selected"] = values_list;
    this.setState({ sub_categories: values });
  };

  // submit handlers

  updateCategory = async () => {
    const { desc, name, tags, sub_categories, category_id } = Object.assign(
      {},
      this.state
    );
    sub_categories.forEach((sc) => {
      sc.values = sc.selected;
      delete sc.selected;
    });
    const data = { desc, name, tags, sub_categories };

    try {
      const res = await apiCall.put(`category/${category_id}`, data);
      message.success(res.data.message);
      this.setState({
        sub_cat_list: [],
        tags_list: [],
        sub_categories: [{ values: [], selected: [] }],
        tags: [],
        name: "",
        desc: "",
      });
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  render() {
    const {
      sub_cat_list,
      tags_list,
      sub_categories,
      tags,
      name,
      desc,
    } = this.state;

    return (
      <div className="dashboard-wrapper">
        <Layout>
          <Sidebar activeNo={"3"} />
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
                    title="Edit Category"
                  />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.updateCategory();
                    }}
                    className="custom-form"
                  >
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          required
                          value={name}
                          onChange={(e) =>
                            this.setState({
                              name: e.target.value,
                            })
                          }
                          type="text"
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-md-8">
                        <input
                          required
                          value={desc}
                          onChange={(e) =>
                            this.setState({
                              desc: e.target.value,
                            })
                          }
                          type="text"
                          placeholder="Description"
                        />
                      </div>
                      <Divider />
                      {sub_categories.map(
                        ({ _id: id, values, selected }, index) => (
                          <div key={id} className="col-md-12 table-input">
                            <Select
                              onChange={(e) =>
                                this.handleSelectSubCat(index, e)
                              }
                              value={id}
                              className="ant-d-form-fields"
                              showSearch
                              required
                              style={{ width: 200 }}
                              placeholder="Select Sub-Category"
                              optionFilterProp="children"
                            >
                              {sub_cat_list.map((item, index) => {
                                return (
                                  <Option key={item.slug_name} value={item._id}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                            {id && (
                              <Select
                                mode="multiple"
                                onChange={(e) => {
                                  this.handleValuesChange(index, e);
                                }}
                                value={selected}
                                className="ant-d-form-fields"
                                showSearch
                                required
                                style={{ width: 200 }}
                                placeholder="Select Object"
                                optionFilterProp="children"
                              >
                                {values.map((item, index) => {
                                  return (
                                    <Option key={index} value={item}>
                                      {item}
                                    </Option>
                                  );
                                })}
                              </Select>
                            )}
                            <button
                              disabled={sub_categories.length === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                this.deleteSubCat(index);
                              }}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        )
                      )}
                      <div className="col-md-12 table-add">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            this.addSubCat();
                          }}
                        >
                          <PlusCircleOutlined /> ADD SUB-CATEGORY
                        </button>
                      </div>
                      <Divider />
                      <div className="col-md-6">
                        <Select
                          mode="tags"
                          className="ant-d-form-fields"
                          showSearch
                          onChange={(e) => this.setState({ tags: e })}
                          value={tags}
                          required
                          style={{ width: 200 }}
                          placeholder="Select Tags"
                          optionFilterProp="children"
                        >
                          {tags_list.map((item) => {
                            return (
                              <Option key={item["_id"]} value={item.name}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="submit"
                          className="form-button"
                          value="UPDATE CATEGORY"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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
