import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "../styles/PlaceOrder.css";
import "../styles/OrderDetails.css";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsOrder, payOrder } from "../actions/OrderAction";
import { ORDER_PAY_RESET } from "../constants/OrderConstant";
import axios from "../Axios";
import { formatPrice } from "../utils/formatPrice";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import PhoneIphoneOutlinedIcon from "@material-ui/icons/PhoneIphoneOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const OrderDetails = (props) => {
  const orderID = props.match.params.id;
  const [upi, setUpi] = useState(null);
  const [upiError, setUpiError] = useState("");
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const dispatch = useDispatch();

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

  useEffect(() => {
    if (!order || successPay || order._id !== orderID) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(detailsOrder(orderID));
    } else if (!order.isPaid && order.paymentMethod !== "Cash on Delivery" && !upi && !upiError) {
      axios
        .get("/api/config/upi")
        .then(({ data }) => setUpi(data))
        .catch(() => setUpiError("Could not load payment details."));
    }
  }, [dispatch, orderID, order, successPay, upi, upiError]);

  const buildUpiParams = () =>
    `pa=${encodeURIComponent(upi.vpa)}` +
    `&pn=${encodeURIComponent(upi.payeeName)}` +
    `&am=${Number(order.totalPrice).toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent("Order " + order._id)}`;

  const genericLink = () => `upi://pay?${buildUpiParams()}`;

  const appLink = () =>
    order.paymentMethod === "PhonePe"
      ? `phonepe://pay?${buildUpiParams()}`
      : `tez://upi/pay?${buildUpiParams()}`;

  const confirmPayment = () => {
    if (!/^\d{12}$/.test(utr)) {
      setUtrError(
        "Please enter the exact 12-digit UTR / reference number from your UPI app.",
      );
      return;
    }
    setUtrError("");
    dispatch(payOrder(order, { id: utr }));
  };

  return loading ? (
    <div className="order-details-page-container">
      <LoadingBox text="Loading order information..." />
    </div>
  ) : error ? (
    <div className="order-details-page-container">
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : order ? (
    <div className="order-details-page-container">
      <Link to="/orderhistory" className="back-res">
        <ArrowBackIcon fontSize="small" />
        <span>Back to Order History</span>
      </Link>

      {/* Top Order ID & Status Header */}
      <div className="order-page-top-header">
        <div>
          <span className="order-chip-meta">Order Confirmation</span>
          <h1 className="order-id-headline">Order #{order._id}</h1>
          <p className="order-placed-date">
            Placed on{" "}
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
          </p>
        </div>

        <div className="order-status-badge-group">
          {order.isPaid ? (
            <span className="status-pill status-paid">
              <CheckCircleIcon fontSize="small" />
              <span>Paid in Full</span>
            </span>
          ) : (
            <span className="status-pill status-pending">
              <ErrorOutlineIcon fontSize="small" />
              <span>Payment Pending</span>
            </span>
          )}

          {order.isDelivered ? (
            <span className="status-pill status-delivered">
              <LocalShippingOutlinedIcon fontSize="small" />
              <span>Delivered</span>
            </span>
          ) : (
            <span className="status-pill status-transit">
              <LocalShippingOutlinedIcon fontSize="small" />
              <span>In Processing</span>
            </span>
          )}
        </div>
      </div>

      <div className="place-order-layout-grid">
        {/* Left Column: Fulfillment Details */}
        <div className="order-details-col">
          {/* Shipping Address */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <LocalShippingOutlinedIcon className="review-icon" />
                <h2>Shipping Destination</h2>
              </div>
            </div>
            <div className="review-card-body">
              <p>
                <strong>Recipient:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalcode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <div className="fulfillment-alert alert-success-mini">
                  <CheckCircleIcon fontSize="small" />
                  <span>Delivered on {order.deliveredAt}</span>
                </div>
              ) : (
                <div className="fulfillment-alert alert-info-mini">
                  <LocalShippingOutlinedIcon fontSize="small" />
                  <span>Preparing for shipment from warehouse</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <PaymentOutlinedIcon className="review-icon" />
                <h2>Payment Method</h2>
              </div>
            </div>
            <div className="review-card-body">
              <p>
                <strong>Method:</strong> {order.paymentMethod}
                {order.paymentMethod !== "Cash on Delivery" && " (UPI)"}
              </p>
              {order.isPaid ? (
                <div className="fulfillment-alert alert-success-mini">
                  <CheckCircleIcon fontSize="small" />
                  <span>Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                </div>
              ) : order.paymentMethod === "Cash on Delivery" ? (
                <div className="fulfillment-alert alert-info-mini">
                  <ErrorOutlineIcon fontSize="small" />
                  <span>Pay with cash when your order is delivered</span>
                </div>
              ) : (
                <div className="fulfillment-alert alert-warning-mini">
                  <ErrorOutlineIcon fontSize="small" />
                  <span>Awaiting payment verification via UPI</span>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items */}
          <div className="review-block-card">
            <div className="review-card-header">
              <div className="review-title-group">
                <ListAltOutlinedIcon className="review-icon" />
                <h2>Order Items ({order.orderItems.length})</h2>
              </div>
            </div>
            <div className="review-card-body">
              <div className="review-items-list">
                {order.orderItems.map((item) => (
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

        {/* Right Column: Order Summary & UPI Payment Box */}
        <div className="order-summary-col">
          <div className="summary-sticky-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row-item">
              <span>Items Subtotal</span>
              <span>{formatPrice(order.itemsPrice, 2)}</span>
            </div>

            <div className="summary-row-item">
              <span>Shipping</span>
              <span>
                {Number(order.shippingPrice) === 0
                  ? "FREE"
                  : formatPrice(order.shippingPrice, 2)}
              </span>
            </div>

            <div className="summary-row-item">
              <span>GST (18%)</span>
              <span>{formatPrice(order.taxPrice, 2)}</span>
            </div>

            <div className="summary-sep-line"></div>

            <div className="summary-grand-total-row">
              <span>Total Amount</span>
              <span className="grand-price-val">
                {formatPrice(order.totalPrice, 2)}
              </span>
            </div>

            {/* Payment Flow */}
            <div className="order-page-pay-container">
              {order.isPaid ? (
                <div className="payment-completed-card">
                  <div className="check-icon-circle">
                    <CheckCircleIcon />
                  </div>
                  <h4>Payment Complete!</h4>
                  <p>Your payment has been successfully recorded and verified.</p>
                </div>
              ) : order.paymentMethod === "Cash on Delivery" ? (
                <div className="cod-status-widget">
                  <div className="cod-info-card">
                    <div className="cod-icon-circle">
                      <span>₹</span>
                    </div>
                    <h4>Cash on Delivery</h4>
                    <p>Payment of <strong>{formatPrice(order.totalPrice, 2)}</strong> will be collected upon delivery.</p>
                    <div className="fulfillment-alert alert-info-mini">
                      <LocalShippingOutlinedIcon fontSize="small" />
                      <span>Your order is being prepared for shipment</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="upi-checkout-widget">
                  {errorPay && (
                    <MessageBox variant="danger">{errorPay}</MessageBox>
                  )}
                  {upiError && (
                    <MessageBox variant="danger">{upiError}</MessageBox>
                  )}
                  {loadingPay && (
                    <LoadingBox text="Verifying transaction reference..." />
                  )}

                  {!upi && !upiError && (
                    <LoadingBox text="Fetching UPI payment link..." />
                  )}

                  {upi && (
                    <div className="upi-payment-panel">
                      <h4 className="upi-panel-title">Pay with UPI</h4>
                      <p className="upi-panel-desc">
                        Tap below on mobile or scan the QR code using any UPI app:
                      </p>

                      <a className="upi-app-direct-btn" href={appLink()}>
                        <PhoneIphoneOutlinedIcon fontSize="small" />
                        <span>Pay {formatPrice(order.totalPrice, 2)} in {order.paymentMethod}</span>
                      </a>

                      <div className="upi-qr-card">
                        <QRCodeSVG
                          value={genericLink()}
                          size={160}
                          bgColor="#ffffff"
                          fgColor="#0f172a"
                          level="M"
                        />
                        <span className="qr-scan-hint">
                          Scan with PhonePe, GPay, Paytm or BHIM
                        </span>
                      </div>

                      <div className="utr-input-box">
                        <label htmlFor="utr-number">
                          Enter 12-Digit UPI Reference / UTR Number:
                        </label>
                        <input
                          id="utr-number"
                          type="text"
                          inputMode="numeric"
                          maxLength={12}
                          value={utr}
                          onChange={(e) =>
                            setUtr(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="e.g. 428901234567"
                        />
                        {utrError && (
                          <MessageBox variant="danger">{utrError}</MessageBox>
                        )}
                        <button
                          type="button"
                          className="upi-confirm-btn"
                          onClick={confirmPayment}
                          disabled={loadingPay}
                        >
                          I've Paid — Confirm Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default OrderDetails;
