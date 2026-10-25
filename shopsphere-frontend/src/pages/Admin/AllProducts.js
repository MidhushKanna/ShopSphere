import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ProductList from "../../components/ProductList";
import "../../styles/AllProducts.css";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { signout } from "../../actions/UserAction";

const AllProducts = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const handleSignOut = () => {
    dispatch(signout());
    history.push("/signin");
  };

  return (
    <div className="admin-products-page-container">
      <div className="admin-header-banner">
        <div className="admin-header-content">
          <div className="admin-pill-tag">
            <DashboardOutlinedIcon fontSize="small" />
            <span>Store Admin Console</span>
          </div>
          <h1>Welcome, {userInfo ? userInfo.name : "Administrator"}!</h1>
          <p>
            Manage live product listings, stock levels, categories, and inventory.
          </p>
        </div>

        <div className="admin-action-row">
          <button
            type="button"
            className="add-new-product-btn"
            onClick={() => alert("Product creation modal / workflow")}
          >
            <AddBoxOutlinedIcon fontSize="small" />
            <span>Create New Product</span>
          </button>
          <button
            type="button"
            className="add-new-product-btn"
            style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
            onClick={handleSignOut}
          >
            <ExitToAppIcon fontSize="small" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <ProductList />
    </div>
  );
};

export default AllProducts;
