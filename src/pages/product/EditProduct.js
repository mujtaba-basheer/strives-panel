import React, { Component } from "react";
import Sidebar from "../../common/sidebar";
import {
  Layout,
  PageHeader,
  message,
  Select,
  Checkbox,
  Divider,
  Spin,
} from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import apiCall from "../../utils/apiCall";

import "antd/dist/antd.css";
const { Header, Content, Footer } = Layout;
const { Option } = Select;

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "C"];

const types = [
  { val: "kurti", name: "Kurti" },
  { val: "pant", name: "Pant" },
  { val: "gown", name: "Gown" },
  { val: "lehenga", name: "Lehenga" },
  { val: "dress", name: "Dress" },
  { val: "plazo", name: "Plazo" },
  { val: "sharara", name: "Sharara" },
  { val: "gharara", name: "Gharara" },
  { val: "skirt", name: "Skirt" },
  { val: "blouse", name: "Blouse" },
];

export default class editProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        name: "",
        short_description: "",
        available_sizes: [],
        mrp: undefined,
        sp: undefined,
        free_shipping: false,
        details: [""],
        rating: 0,
        rating_count: 0,
        materials: [],
        subtitle: "",
        category: "",
        sub_categories: [],
        tags: [],
        discount: undefined,
        stocks_available: undefined,
        colour: {},
        set: [],
      },
      photos_num: undefined,
      categories: [],
      sub_categories: [{ values: [] }],
      coloursList: [],
      tags: [],
      materials: [],
      loading: false,
      main_shuffle: 1,
      small_shuffle: 1,
      combinations: [[]],
      product_id: "",
    };
  }

  componentDidMount = async () => {
    const product_id = this.props.location.pathname.split("/")[3];
    let product;

    try {
      let resp = await apiCall.get(`product/${product_id}`);
      product = Object.assign({}, resp.data.data);

      delete product.gallery;
      delete product.isBlocked;
      delete product.slug_name;
      delete product.date;

      this.setState({ product, product_id });
    } catch (error) {
      console.error(error);
      if (error.response) message.error(error.response.data.message);
    }

    const api0 = apiCall.get("colours");
    const api1 = apiCall.get("categories");
    const api2 = apiCall.get("tags");
    const api3 = apiCall.get("materials");

    try {
      const [
        {
          data: { data: data0 },
        },
        {
          data: { data: data1 },
        },
        {
          data: { data: data2 },
        },
        {
          data: { data: data3 },
        },
      ] = await Promise.all([api0, api1, api2, api3]);

      const categories = [...data1];
      const category = categories.find(({ _id }) => product.category === _id);
      let sub_categories;
      if (category) sub_categories = category.sub_categories;
      else
        sub_categories = product.sub_categories.map(({ _id }) => ({
          values: [],
          _id,
        }));

      this.setState({
        coloursList: data0,
        categories: data1,
        sub_categories,
        tags: data2,
        materials: data3,
      });
    } catch (error) {
      console.error(error);
      if (error.response) message.error(error.response.data.message);
    }
  };

  handleCategoryChange = (id) => {
    const categories = [...this.state.categories];
    const category = categories.find(({ _id }) => id === _id);
    if (category) {
      const { tags, sub_categories } = category;
      console.log(sub_categories);
      const product = Object.assign({}, this.state.product);
      product.tags = tags;
      product.category = id;
      product.sub_categories = sub_categories.map((subCat) => {
        const subCatObj = Object.assign({}, subCat);
        delete subCatObj.values;
        subCatObj.value = "";
        return subCatObj;
      });
      console.log(product.sub_categories, sub_categories);
      this.setState({
        sub_categories,
        product,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    const { product_id } = this.state;
    const product = Object.assign({}, this.state.product);
    delete product.display;
    try {
      const res = await apiCall.put(`product/${product_id}`, product);
      message.success(res.data.message);
      setTimeout(() => this.props.history.push("/product/list"), 2000);
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      product,
      categories,
      sub_categories: sub_categories_list,
      tags: tags_list,
      loading,
      coloursList,
      materials: materials_list,
    } = this.state;
    const {
      name,
      short_description,
      free_shipping,
      available_sizes,
      materials,
      mrp,
      sp,
      sub_categories,
      subtitle,
      category,
      details,
      discount,
      tags,
      stocks_available,
      colour,
      set,
    } = product;

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
                      title="Edit Product"
                      subTitle=""
                    />
                    <form
                      onSubmit={this.handleSubmit.bind(this)}
                      className="custom-form"
                    >
                      <div className="row">
                        <div className="col-md-3">
                          <label>Product Name</label>
                          <input
                            required
                            value={name}
                            onChange={(e) => {
                              product.name = e.target.value;
                              this.setState({ product });
                            }}
                            type="text"
                            placeholder="Name"
                          />
                        </div>
                        <div className="col-md-9">
                          <label>Short Description</label>
                          <input
                            value={short_description}
                            onChange={(e) => {
                              product.short_description = e.target.value;
                              this.setState({ product });
                            }}
                            type="text"
                            placeholder="Description"
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Maximum Retail Price</label>
                          <input
                            required
                            value={mrp}
                            onChange={(e) => {
                              product.mrp = Number(e.target.value);
                              this.setState({ product });
                            }}
                            type="number"
                            placeholder="MRP."
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Selling Price</label>
                          <input
                            required
                            value={sp}
                            onChange={(e) => {
                              product.sp = Number(e.target.value);
                              this.setState({ product });
                            }}
                            type="number"
                            placeholder="SP."
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Discount</label>
                          <input
                            required
                            value={discount}
                            onChange={(e) => {
                              product.discount = Number(e.target.value);
                              this.setState({ product });
                            }}
                            type="number"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Available Stocks</label>
                          <input
                            required
                            value={stocks_available}
                            onChange={(e) => {
                              product.stocks_available = Number(e.target.value);
                              this.setState({ product });
                            }}
                            type="number"
                            placeholder="No. of Stocks"
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Subtitle</label>
                          <input
                            value={subtitle}
                            onChange={(e) => {
                              product.subtitle = e.target.value;
                              this.setState({ product });
                            }}
                            type="text"
                            placeholder="Subtitle"
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Sizes Available</label>
                          <Select
                            mode="multiple"
                            value={available_sizes}
                            onChange={(e) => {
                              product.available_sizes = e;
                              this.setState({ product });
                            }}
                            allowClear
                            className="ant-d-form-fields"
                            showSearch
                            required
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Available Sizes"
                            optionFilterProp="children"
                          >
                            {sizes.map((size) => (
                              <Option key={size} value={size}>
                                {size}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-md-4">
                          <label>Product/Set Types</label>
                          <Select
                            mode="multiple"
                            value={set}
                            onChange={(e) => {
                              product.set = e;
                              this.setState({ product });
                            }}
                            allowClear
                            className="ant-d-form-fields"
                            showSearch
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Set Types"
                            optionFilterProp="children"
                          >
                            {types.map(({ val, name }) => (
                              <Option key={val} value={val}>
                                {name}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <Divider>Product Details</Divider>
                      <div className="row">
                        {details.map((value, index) => (
                          <div key={index} className="col-md-12 table-input">
                            <div className="col-md-6">
                              {/* <label>Detail: {index + 1}</label> */}
                              <input
                                required
                                value={details[index]}
                                onChange={(e) => {
                                  product.details[index] = e.target.value;
                                  this.setState({ product });
                                }}
                                type="text"
                                placeholder={`Detail ${index + 1}`}
                              />
                            </div>
                            <button
                              disabled={sub_categories.length === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                product.details.splice(index, 1);
                                this.setState({ product });
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
                              product.details.push("");
                              this.setState({ product });
                            }}
                          >
                            <PlusCircleOutlined /> ADD DETAIL
                          </button>
                        </div>
                      </div>
                      <Divider />
                      <div className="row">
                        <div className="col-md-4">
                          <label>Free Shipping?</label>
                          <Checkbox
                            style={{
                              border: "1px solid grey",
                              padding: "13px 20px",
                              marginBottom: "15px",
                              width: "100%",
                            }}
                            checked={free_shipping}
                            onChange={(e) => {
                              product.free_shipping = e.target.checked;
                              this.setState({ product });
                            }}
                          >
                            Free Shipping
                          </Checkbox>
                        </div>
                        <div className="col-md-4">
                          <label>Colour</label>
                          <Select
                            value={colour["_id"]}
                            onChange={(e) => {
                              const index = coloursList.findIndex(
                                ({ _id: id }) => id === e
                              );
                              if (index >= 0) {
                                product.colour = coloursList[index];
                                this.setState({ product });
                              }
                            }}
                            className="ant-d-form-fields"
                            required
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Colour"
                            optionFilterProp="children"
                          >
                            {coloursList.map(
                              ({ _id: id, full_name, hexcode }) => (
                                <Option key={id} value={id}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <p>{full_name}</p>
                                    <span
                                      style={{
                                        height: "20px",
                                        width: "20px",
                                        borderRadius: "50%",
                                        background: `#${hexcode}`,
                                        display: "inline-block",
                                        marginTop: "5px",
                                        marginLeft: "10px",
                                      }}
                                    ></span>
                                  </div>
                                </Option>
                              )
                            )}
                          </Select>
                        </div>
                        <div className="col-md-4">
                          <label>Category</label>
                          <Select
                            value={category}
                            onChange={this.handleCategoryChange}
                            className="ant-d-form-fields"
                            required
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Category"
                            optionFilterProp="children"
                          >
                            {categories.map(({ _id: id, name }) => (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="row">
                        {sub_categories.map(
                          ({ _id: id, name, value }, index) => (
                            <div key={id} className="col-md-4">
                              <label>{name}</label>
                              <Select
                                value={value}
                                onChange={(e) => {
                                  product.sub_categories[index]["value"] = e;
                                  this.setState({ product });
                                }}
                                className="ant-d-form-fields"
                                required
                                style={{ width: 200, padding: "9px 15px" }}
                                placeholder="Select Value"
                                optionFilterProp="children"
                              >
                                {sub_categories_list.length ===
                                sub_categories.length ? (
                                  sub_categories_list[index].values.map(
                                    (val) => (
                                      <Option key={val} value={val}>
                                        {val}
                                      </Option>
                                    )
                                  )
                                ) : (
                                  <Option value={null}>Select Value</Option>
                                )}
                              </Select>
                            </div>
                          )
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Product Tags</label>
                          <Select
                            value={tags}
                            mode="tags"
                            onChange={(e) => {
                              product.tags = e;
                              this.setState({ product });
                            }}
                            className="ant-d-form-fields"
                            required
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Tags"
                            optionFilterProp="children"
                          >
                            {tags_list.map((tag) => (
                              <Option key={tag} value={tag}>
                                {tag}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-md-6">
                          <label>Materials</label>
                          <Select
                            value={materials}
                            mode="multiple"
                            onChange={(e) => {
                              product.materials = e;
                              this.setState({ product });
                            }}
                            className="ant-d-form-fields"
                            required
                            style={{ width: 200, padding: "9px 15px" }}
                            placeholder="Select Materials"
                            optionFilterProp="children"
                          >
                            {materials_list.map(
                              ({ name: material, slug_name: slug }) => (
                                <Option key={slug} value={slug}>
                                  {material}
                                </Option>
                              )
                            )}
                          </Select>
                        </div>
                      </div>
                      <Divider />
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="submit"
                            className="form-button"
                            value="UPDATE PRODUCT"
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
