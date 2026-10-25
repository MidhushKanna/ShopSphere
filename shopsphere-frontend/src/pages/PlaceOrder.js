import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/PlaceOrder.css";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { createdOrder } from "../actions/OrderAction";
import { ORDER_CREATE_RESET } from "../constants/OrderConstant";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { formatPrice } from "../utils/formatPrice";

import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const PlaceOrder = (props) => {
  const cart = useSelector((state) => state.cart);

  if (!cart.paymentMethod) {
    props.history.push("/payment");
  }

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  const toPrice = (num) => Number(num.toFixed(2));

  const itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0),
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = toPrice(0.18 * itemsPrice);
  const totalPrice = toPrice(itemsPrice + shippingPrice + taxPrice);

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(
      createdOrder({
        ...cart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderItems: cart.cartItems,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({
        type: ORDER_CREATE_RESET,
      });
    }
  }, [dispatch, order, props.history, success]);

  return (
    <div className="place-order-page-container">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="place-order-layout-grid">
        {/* Left Column: Order Verification Details */}
        <div className="order-details-col">
          {/* Shipping Address Card */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <LocalShippingOutlinedIcon className="review-icon" />
                <h2>Shipping Destination</h2>
              </div>
              <Link to="/shipping" className="edit-step-link">
                <EditOutlinedIcon fontSize="small" />
                <span>Edit</span>
              </Link>
            </div>
            <div className="review-card-body">
              <p className="recipient-name">
                <strong>Recipient:</strong> {cart.shippingAddress.fullName}
              </p>
              <p className="recipient-address">
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalcode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <PaymentOutlinedIcon className="review-icon" />
                <h2>Payment Method</h2>
              </div>
              <Link to="/payment" className="edit-step-link">
                <EditOutlinedIcon fontSize="small" />
                <span>Edit</span>
              </Link>
            </div>
            <div className="review-card-body">
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
                {cart.paymentMethod !== "Cash on Delivery" && " (UPI)"}
              </p>
            </div>
          </div>

          {/* Ordered Items Card */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <ListAltOutlinedIcon className="review-icon" />
                <h2>Order Items ({cart.cartItems.length})</h2>
              </div>
            </div>
            <div className="review-card-body">
              <div className="review-items-list">
                {cart.cartItems.map((item) => (
                  <div key={item.product} className="review-item-row">
                    <div className="review-item-thumb">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="review-item-name-col">
                      <Link
                        to={`/products/product/${item.product}`}
                        className="review-product-name"
                      >
                        {item.name}
                      </Link>
                      <span className="review-item-calc">
                        {item.qty} × {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="review-item-total">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="order-summary-col">
          <div className="summary-sticky-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row-item">
              <span>Items Total</span>
              <span>{formatPrice(itemsPrice, 2)}</span>
            </div>

            <div className="summary-row-item">
              <span>Delivery Fee</span>
              <span>
                {shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice, 2)}
              </span>
            </div>

            <div className="summary-row-item">
              <span>Estimated GST (18%)</span>
              <span>{formatPrice(taxPrice, 2)}</span>
            </div>

            <div className="summary-sep-line"></div>

            <div className="summary-grand-total-row">
              <span>Total Payable</span>
              <span className="grand-price-val">
                {formatPrice(totalPrice, 2)}
              </span>
            </div>

            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0 || loading}
              className="place-order-confirm-btn"
            >
              <LockOutlinedIcon fontSize="small" />
              <span>{loading ? "Placing Order..." : cart.paymentMethod === "Cash on Delivery" ? "Place Order" : "Place Order & Pay"}</span>
            </button>

            {loading && <LoadingBox text="Creating your order..." />}
            {error && <MessageBox variant="danger">{error}</MessageBox>}

            <div className="summary-notes-footer">
              <p>🔒 100% Secure Checkout Guarantee</p>
              <p>UPI QR and Direct App Payment supported on next step.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
