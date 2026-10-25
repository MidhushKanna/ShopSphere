import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Rating from "../components/Rating";
import "../styles/ProductPage.css";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsProduct } from "../actions/ProdcutActions";
import { formatPrice } from "../utils/formatPrice";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import SecurityOutlinedIcon from "@material-ui/icons/SecurityOutlined";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";

const ProductPage = (props) => {
  const dispatch = useDispatch();
  const productID = props.match.params.id;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(detailsProduct(productID));
  }, [dispatch, productID]);

  const addToCart = () => {
    props.history.push(`/cart/${productID}?qty=${qty}`);
  };

  return (
    <div className="product-detail-page-container">
      <Link to="/" className="back-res">
        <ArrowBackIcon fontSize="small" />
        <span>Back to products</span>
      </Link>

      {loading ? (
        <LoadingBox text="Loading product details..." />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : product ? (
        <div className="product-detail-layout">
          {/* Column 1: Showcase Image Gallery */}
          <div className="product-gallery-card">
            <div className="product-gallery-frame">
              <img
                src={product.image}
                alt={product.name}
                className="product-hero-image"
              />
            </div>
          </div>

          {/* Column 2: Product Specifications & Info */}
          <div className="product-specs-card">
            {product.category && (
              <span className="product-category-chip">{product.category}</span>
            )}
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-meta-rating-bar">
              <Rating rating={product.rating} numRev={product.numRev} />
              <span className="verified-badge">
                <CheckCircleOutlinedIcon fontSize="small" />
                Verified Product
              </span>
            </div>

            <div className="product-detail-price-box">
              <span className="detail-price-main">
                {formatPrice(product.price)}
              </span>
              <span className="detail-tax-note">Inclusive of all taxes</span>
            </div>

            <div className="product-features-checklist">
              <div className="checklist-item">
                <LocalShippingOutlinedIcon />
                <span>Free Express Delivery across India</span>
              </div>
              <div className="checklist-item">
                <SecurityOutlinedIcon />
                <span>1 Year Official Brand Warranty</span>
              </div>
            </div>

            <div className="product-description-container">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Column 3: Sticky Checkout Card */}
          <div className="product-buybox-card">
            <div className="buybox-inner">
              <h3 className="buybox-header">Purchase Summary</h3>

              <div className="buybox-row">
                <span className="buybox-label">Price per unit</span>
                <span className="buybox-val">{formatPrice(product.price)}</span>
              </div>

              <div className="buybox-row">
                <span className="buybox-label">Stock Status</span>
                {product.stock > 10 ? (
                  <span className="badge-pill badge-in-stock">In Stock</span>
                ) : product.stock > 0 ? (
                  <span className="badge-pill badge-low-stock">
                    Only {product.stock} Left!
                  </span>
                ) : (
                  <span className="badge-pill badge-out-stock">
                    Sold Out
                  </span>
                )}
              </div>

              {userInfo && userInfo.isAdmin ? (
                <div className="admin-product-view-panel">
                  <div className="admin-view-tag">
                    <SupervisorAccountOutlinedIcon fontSize="small" />
                    <span>Admin Mode</span>
                  </div>
                  <p className="admin-view-desc">
                    Customer purchasing and cart ordering is disabled for administrator accounts.
                  </p>
                  <Link to="/productlist" className="admin-manage-inv-btn">
                    <span>Manage Products in Admin Console</span>
                  </Link>
                </div>
              ) : product.stock > 0 && (
                <>
                  <div className="buybox-row qty-row">
                    <span className="buybox-label">Quantity</span>
                    <div className="styled-qty-select">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        aria-label="Select quantity"
                      >
                        {[...Array(product.stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="buybox-divider"></div>

                  <div className="buybox-row total-row">
                    <span className="buybox-total-label">Subtotal</span>
                    <span className="buybox-total-price">
                      {formatPrice(product.price * qty)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="buybox-add-btn"
                    onClick={addToCart}
                  >
                    <ShoppingCartOutlinedIcon />
                    <span>Add to Cart</span>
                  </button>
                </>
              )}

              <div className="buybox-guarantee">
                <p>🔒 <strong>Secure transaction</strong> — UPI & Cards</p>
                <p>🚚 Ships within 24 hours from ShopSphere Hub</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductPage;
