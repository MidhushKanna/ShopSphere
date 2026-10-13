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
    } else if (!order.isPaid && !upi && !upiError) {
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
        "Enter the 12-digit UTR / reference number from your UPI app.",
      );
      return;
    }
    setUtrError("");
    dispatch(payOrder(order, { id: utr }));
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h3 id="order-id">Order ID: {order._id}</h3>
      <div className="row-container">
        <div className="col-6">
          <ul>
            <li>
              <div className="card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName}
                </p>
                <p>
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},
                  {order.shippingAddress.postalcode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered.</MessageBox>
                )}
              </div>
            </li>

            <li>
              <div className="card-body">
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong> {order.paymentMethod} <br />
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid.</MessageBox>
                )}
              </div>
            </li>

            <li>
              <div className="card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row1 order-row1">
                        <div className="small">
                          <img src={item.image} alt=""></img>
                        </div>

                        <div className="min-30">
                          <Link to={`/products/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <p>
                          {item.qty} x {formatPrice(item.price)} ={" "}
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="col-7">
          <div className="card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <p>Items</p>
                <p>{formatPrice(order.itemsPrice, 2)}</p>
              </li>
              <li>
                <p>Shipping</p>
                <p>{formatPrice(order.shippingPrice, 2)}</p>
              </li>
              <li>
                <p>GST (18%)</p>
                <p>{formatPrice(order.taxPrice, 2)}</p>
              </li>
              <li>
                <p>
                  <strong>Total</strong>
                </p>
                <p>
                  <strong>{formatPrice(order.totalPrice, 2)}</strong>
                </p>
              </li>

              <div className="order-page-pay-btn">
                {order.isPaid ? (
                  <MessageBox variant="success">Payment done!</MessageBox>
                ) : (
                  <>
                    {errorPay && (
                      <MessageBox variant="danger">{errorPay}</MessageBox>
                    )}
                    {upiError && (
                      <MessageBox variant="danger">{upiError}</MessageBox>
                    )}
                    {loadingPay && <LoadingBox />}

                    {!upi && !upiError && <LoadingBox />}

                    {upi && (
                      <div className="upi-pay">
                        <a className="upi-btn" href={appLink()}>
                          Pay {formatPrice(order.totalPrice, 2)} with{" "}
                          {order.paymentMethod}
                        </a>

                        <p>On a computer? Scan with any UPI app:</p>
                        <QRCodeSVG value={genericLink()} size={160} />

                        <p>
                          After paying, enter the 12-digit UTR / reference
                          number shown in your app:
                        </p>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={12}
                          value={utr}
                          onChange={(e) =>
                            setUtr(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="12-digit UTR"
                        />
                        {utrError && (
                          <MessageBox variant="danger">{utrError}</MessageBox>
                        )}
                        <button
                          type="button"
                          className="upi-confirm-btn"
                          onClick={confirmPayment}
                        >
                          I've paid
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
