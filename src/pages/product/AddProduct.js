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

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const combinations = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

export default class addProduct extends Component {
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
        gallery: {
          main: [{ name: "", data: "", src: "", type: "", extension: "" }],
          small: [{ name: "", data: "", src: "", type: "", extension: "" }],
        },
        display: {
          main: [],
          small: [],
        },
        isBlocked: true,
      },
      categories: [],
      sub_categories: [],
      coloursList: [],
      tags: [],
      materials: [],
      loading: false,
      main_shuffle: 1,
      small_shuffle: 1,
    };
  }

  componentDidMount = async () => {
    let res;

    try {
      res = await apiCall.get("colours");
      this.setState({ coloursList: res.data.data });
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }

    try {
      res = await apiCall.get("categories");
      this.setState({ categories: res.data.data });
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }

    try {
      res = await apiCall.get("tags");
      this.setState({ tags: res.data.data.map(({ name }) => name) });
    } catch (error) {
      console.error(error.response);
      message.error(error.response.data.message);
    }

    try {
      res = await apiCall.get("materials");
      this.setState({ materials: res.data.data });
    } catch (error) {
      console.error(error.response);
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

  setMainGallery = async (e) => {
    const { files } = e.target,
      arr = [],
      gallery = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf(".")),
        name = file.name,
        mimeType = file.type;

      try {
        const data = await this.upload(file);

        gallery.push({
          name,
          data,
          extension,
          type: mimeType,
        });

        arr.push(URL.createObjectURL(file));
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }

    const product = Object.assign({}, this.state.product);
    product.gallery.main = gallery;
    product.display.main = arr;
    this.setState({ product });
  };

  setSmallGallery = async (e) => {
    const { files } = e.target,
      arr = [],
      gallery = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf(".")),
        name = file.name,
        mimeType = file.type;

      try {
        const data = await this.upload(file);

        gallery.push({
          name,
          data,
          extension,
          type: mimeType,
        });

        arr.push(URL.createObjectURL(file));
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }

    const product = Object.assign({}, this.state.product);
    product.gallery.small = gallery;
    product.display.small = arr;
    this.setState({ product });
  };

  shufflePictures = (size) => {
    const product = Object.assign({}, this.state.product),
      combination = combinations[this.state[`${size}_shuffle`]],
      shuffle_no = this.state[`${size}_shuffle`];
    const gallery_shuffle = [],
      display_shuffle = [];
    for (let i = 0; i < 3; i++) {
      gallery_shuffle[i] = product.gallery[size][combination[i]];
      display_shuffle[i] = product.display[size][combination[i]];
    }

    product.gallery[size] = gallery_shuffle;
    product.display[size] = display_shuffle;
    console.log(gallery_shuffle, size);

    const stateObj = { product };
    stateObj[`${size}_shuffle`] = (shuffle_no + 1) % 3;

    this.setState(stateObj);
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
    const product = Object.assign({}, this.state.product);
    delete product.display;
    try {
      const res = await apiCall.post("product", product);
      message.success(res.data.message);
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
      display,
      tags,
      stocks_available,
      colour,
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
                      title="Add Product"
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
                            required
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
                        <div className="col-md-6">
                          <label>Subtitle</label>
                          <input
                            required
                            value={subtitle}
                            onChange={(e) => {
                              product.subtitle = e.target.value;
                              this.setState({ product });
                            }}
                            type="text"
                            placeholder="Subtitle"
                          />
                        </div>
                        <div className="col-md-6">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                                {sub_categories_list[index].values.map(
                                  (val) => (
                                    <Option key={val} value={val}>
                                      {val}
                                    </Option>
                                  )
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
                      <Divider>Pictures</Divider>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Pictures (Big)</label>
                          <input
                            required
                            multiple
                            onChange={this.setMainGallery.bind(this)}
                            type="file"
                            accept="image/*"
                            placeholder="Images"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Pictures (Small)</label>
                          <input
                            required
                            multiple
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
                          {display.main.map((src, index) => (
                            <img
                              style={{
                                width: "auto",
                                height: "150px",
                              }}
                              alt=""
                              src={src}
                              key={index}
                            />
                          ))}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              this.shufflePictures("main");
                            }}
                            className="shuffle-btn"
                          >
                            Shuffle
                          </button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginTop: "1em",
                            justifyContent: "space-evenly",
                          }}
                          className="col-md-12"
                        >
                          {display.small.map((src, index) => (
                            <img
                              style={{
                                width: "auto",
                                height: "100px",
                              }}
                              alt=""
                              src={src}
                              key={index}
                            />
                          ))}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              this.shufflePictures("small");
                            }}
                            className="shuffle-btn"
                          >
                            Shuffle
                          </button>
                        </div>
                      </div>
                      <Divider />
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="submit"
                            className="form-button"
                            value="ADD PRODUCT"
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
