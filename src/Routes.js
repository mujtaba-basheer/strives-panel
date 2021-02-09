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
const addProduct = lazy(() => import("./pages/product/AddProduct"));

const addCategory = lazy(() => import("./pages/product/category/AddCat"));
const listCategory = lazy(() => import("./pages/product/category/CatList"));
const editCategory = lazy(() => import("./pages/product/category/EditCat"));

// const UserDashboard = lazy(() => import("./pages/userdashboard"));
// const addmanager = lazy(() => import("./pages/addmanager"));
// const adduser = lazy(() => import("./pages/adduser"));
// const myprofile = lazy(() => import("./pages/myprofile"));
// const higherprofile = lazy(() => import("./pages/higherprofile"));
// const managerslist = lazy(() => import("./pages/managerslist"));
// const objectslist = lazy(() => import("./pages/objectslist"));
// const company = lazy(() => import("./pages/company"));
// const singleuser = lazy(() => import("./pages/singleuser"));
// const userslist = lazy(() => import("./pages/userslist"));
// const responses = lazy(() => import("./pages/responses"));
// const addFields = lazy(() => import("./pages/addFields"));
// const enterObjectData = lazy(() => import("./pages/enterObjectData"));
// const forgotPassword = lazy(() => import("./pages/forgotPassword"));
// const ObjectType = lazy(() => import("./pages/object-type"));

let token = getToken();
const ProtectedRoute = ({ ...props }) =>
  token ? <Route {...props} /> : <Redirect to="/login" />;

// const BreakevenRoute = ({ ...props }) =>
//     token ? <Redirect to="/admindashboard" /> : <Route {...props} />;

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isUpdated:false
    };
  }
  componentWillMount() {}

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

            <ProtectedRoute
              exact
              path="/admin/dashboard"
              component={Dashboard}
            />
            <ProtectedRoute
              exact
              path="/manager/dashboard"
              component={Dashboard}
            />
            {/* <ProtectedRoute
              exact
              path="/user/dashboard"
              component={UserDashboard}
            />
            <ProtectedRoute exact path="/add-manager" component={addmanager} />
            <ProtectedRoute exact path="/add-user" component={adduser} />
            <ProtectedRoute exact path="/user/profile" component={myprofile} />
            <ProtectedRoute
              exact
              path="/manager/profile"
              component={higherprofile}
            />
            <ProtectedRoute
              exact
              path="/admin/profile"
              component={higherprofile}
            />
            <ProtectedRoute exact path="/managers" component={managerslist} />
            <ProtectedRoute exact path="/responses" component={responses} />
            <ProtectedRoute exact path="/objects" component={objectslist} />
            <ProtectedRoute exact path="/company" component={company} />
            <ProtectedRoute
              exact
              path="/single-user/:userId"
              component={singleuser}
            />
            <ProtectedRoute exact path="/users" component={userslist} />
            <ProtectedRoute exact path="/fields" component={addFields} />
            <ProtectedRoute
              exact
              path="/add-data"
              component={enterObjectData}
            />
            <ProtectedRoute exact path="/object-type" component={ObjectType} /> */}
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

export default Routes;
