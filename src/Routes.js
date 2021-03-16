import React, { Component, Suspense, lazy } from "react";
// import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Spin } from "antd";
import { getToken } from "./utils/store";
const LoginPage = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));

// PRODUCT

const tags = lazy(() => import("./pages/product/Tags"));
const subCategories = lazy(() => import("./pages/product/SubCat"));
const colours = lazy(() => import("./pages/product/Colours"));
const materials = lazy(() => import("./pages/product/Materials"));

const addProduct = lazy(() => import("./pages/product/AddProduct"));
const productList = lazy(() => import("./pages/product/ProductList"));

const addCategory = lazy(() => import("./pages/product/category/AddCat"));
const listCategory = lazy(() => import("./pages/product/category/CatList"));
const editCategory = lazy(() => import("./pages/product/category/EditCat"));

// ASSETS

const images = lazy(() => import("./pages/asset/Images"));

// ORDERS

const ordersList = lazy(() => import("./pages/order/OrdersList"));

let token = getToken();
const ProtectedRoute = ({ ...props }) =>
  token ? <Route {...props} /> : <Redirect to="/login" />;

class Routes extends Component {
  render() {
    return (
      <Router>
        <Suspense
          fallback={
            <div className="spin-container">
              <Spin
                style={{
                  backgroundColor: "white",
                  color: "#086e3f",
                }}
                spinning={true}
                tip="Please Wait..."
              ></Spin>
            </div>
          }
        >
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/" component={LoginPage} />
            {/* <Route exact path="/forgot-password" component={forgotPassword} /> */}

            {/* PRODUCTS */}

            <ProtectedRoute exact path="/product/tags" component={tags} />

            <ProtectedRoute
              exact
              path="/product/materials"
              component={materials}
            />

            <ProtectedRoute
              exact
              path="/product/sub-categories"
              component={subCategories}
            />

            <ProtectedRoute
              exact
              path="/product/add-category"
              component={addCategory}
            />

            <ProtectedRoute
              exact
              path="/product/list"
              component={productList}
            />

            <ProtectedRoute
              exact
              path="/product/list-category"
              component={listCategory}
            />

            <ProtectedRoute
              exact
              path="/product/edit-category/:id"
              component={editCategory}
            />

            <ProtectedRoute exact path="/product/colours" component={colours} />

            <ProtectedRoute
              exact
              path="/product/add-product"
              component={addProduct}
            />

            {/* ASSETS */}

            <ProtectedRoute exact path="/assets/images" component={images} />

            {/* ORDERS */}

            <ProtectedRoute exact path="/orders/list" component={ordersList} />
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

export default Routes;
