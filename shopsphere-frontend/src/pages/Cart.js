import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../actions/CartAction";
import { Link } from "react-router-dom";
import "../styles/Cart.css";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ShoppingBasketOutlinedIcon from "@material-ui/icons/ShoppingBasketOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { formatPrice } from "../utils/formatPrice";

const Cart = (props) => {
  const productID = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      props.history.push("/orderlist");
      return;
    }
    if (productID) {
      dispatch(addToCart(productID, qty));
    }
  }, [dispatch, productID, qty, userInfo, props.history]);

  const removeProduct = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOut = () => {
    props.history.push("/shipping");
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const isFreeDelivery = subtotalPrice >= 499;
  const freeShippingThreshold = 499;
  const progressPercent = Math.min(
    100,
    (subtotalPrice / freeShippingThreshold) * 100,
  );

  return (
    <div className="cart-page-container">
      <Link to="/" className="back-res">
        <ArrowBackIcon fontSize="small" />
        <span>Continue Shopping</span>
      </Link>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header-row">
            <div>
              <h1 className="cart-main-heading">Shopping Cart</h1>
              <p className="cart-subheading">
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {cartItems.length > 0 && (
              <span className="cart-tag-free">
                <LocalShippingOutlinedIcon fontSize="small" />
                {isFreeDelivery ? "Free Delivery Unlocked" : "Standard Delivery"}
              </span>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon-circle">
                <ShoppingBasketOutlinedIcon />
              </div>
              <h2>Your cart is currently empty</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <Link to="/" className="empty-cart-cta-btn">
                <span>Start Shopping</span>
                <ArrowForwardIcon fontSize="small" />
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product} className="cart-item-card">
                  <div className="item-thumbnail-box">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="item-details-box">
                    <Link
                      to={`/products/product/${item.product}`}
                      className="item-name-link"
                    >
                      {item.name}
                    </Link>
                    <p className="item-unit-price">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="item-controls-box">
                    <div className="item-qty-wrapper">
                      <label htmlFor={`qty-${item.product}`} className="sr-only">
                        Qty:
                      </label>
                      <select
                        id={`qty-${item.product}`}
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value)),
                          )
                        }
                      >
                        {[...Array(item.stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            Qty: {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="item-total-price">
                      {formatPrice(item.price * item.qty)}
                    </div>

                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => removeProduct(item.product)}
                      title="Remove item from cart"
                      aria-label="Remove item"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h3 className="summary-card-title">Order Summary</h3>

            {/* Shipping Progress Bar */}
            <div className="free-shipping-progress-box">
              <div className="progress-text-row">
                {isFreeDelivery ? (
                  <span className="free-unlocked">
                    🎉 You've unlocked <strong>FREE Delivery!</strong>
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(freeShippingThreshold - subtotalPrice)}</strong> more for FREE delivery
                  </span>
                )}
              </div>
              <div className="shipping-progress-track">
                <div
                  className="shipping-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="summary-line-row">
              <span className="summary-label">Items Subtotal</span>
              <span className="summary-val">{formatPrice(subtotalPrice)}</span>
            </div>

            <div className="summary-line-row">
              <span className="summary-label">Estimated Shipping</span>
              <span className="summary-val">
                {cartItems.length === 0
                  ? "—"
                  : isFreeDelivery
                  ? "FREE"
                  : formatPrice(50)}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total-row">
              <span className="total-label">Estimated Total</span>
              <span className="total-price-val">
                {formatPrice(
                  cartItems.length === 0
                    ? 0
                    : isFreeDelivery
                    ? subtotalPrice
                    : subtotalPrice + 50,
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={checkOut}
              className="cart-checkout-cta"
              disabled={cartItems.length === 0}
            >
              <LockOutlinedIcon fontSize="small" />
              <span>Proceed to Checkout</span>
            </button>

            <div className="checkout-security-notes">
              <p>🔒 256-Bit SSL Encrypted Checkout</p>
              <p>⚡ Fast UPI & Card Processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
