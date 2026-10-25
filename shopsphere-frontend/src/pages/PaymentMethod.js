import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/CartAction";
import CheckoutSteps from "../components/CheckoutSteps";
import "../styles/PaymentMethod.css";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const METHODS = [
  {
    id: "phonepe",
    value: "PhonePe",
    title: "PhonePe UPI",
    subtitle: "Pay directly via PhonePe app or scan UPI QR",
    badge: "Fast & Popular",
    iconText: "Pe",
    iconBg: "#5f259f",
  },
  {
    id: "gpay",
    value: "GPay",
    title: "Google Pay (GPay)",
    subtitle: "Fast 1-tap checkout via Google Pay UPI",
    badge: "Recommended",
    iconText: "G",
    iconBg: "#4285f4",
  },
  {
    id: "cod",
    value: "Cash on Delivery",
    title: "Cash on Delivery",
    subtitle: "Pay when your order is delivered to your doorstep",
    badge: "No Prepayment",
    iconText: "₹",
    iconBg: "#16a34a",
  },
];

const PaymentMethod = (props) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    props.history.push("/shipping");
  }

  const [method, setMethod] = useState("PhonePe");
  const dispatch = useDispatch();

  const submitMethod = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(method));
    props.history.push("/placeorder");
  };

  return (
    <div className="payment-page-container">
      <CheckoutSteps step1 step2 step3 />

      <div className="pay-method-card-wrapper">
        <form className="form pay-method-form" onSubmit={submitMethod}>
          <div className="form-heading-block">
            <div className="form-icon-pill">
              <PaymentOutlinedIcon />
            </div>
            <h1>Select Payment Method</h1>
            <p>Choose your preferred UPI payment option</p>
          </div>

          <div className="methods-radio-group">
            {METHODS.map((m) => {
              const isSelected = method === m.value;
              return (
                <div
                  key={m.id}
                  className={`payment-option-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setMethod(m.value)}
                >
                  <div className="method-left-side">
                    <div
                      className="method-avatar-logo"
                      style={{ backgroundColor: m.iconBg }}
                    >
                      {m.iconText}
                    </div>
                    <div className="method-text-details">
                      <div className="method-title-row">
                        <span className="method-name">{m.title}</span>
                        {m.badge && (
                          <span className="method-badge-pill">{m.badge}</span>
                        )}
                      </div>
                      <p className="method-subtitle">{m.subtitle}</p>
                    </div>
                  </div>

                  <div className="method-radio-indicator">
                    {isSelected ? (
                      <CheckCircleIcon className="checked-icon" />
                    ) : (
                      <RadioButtonUncheckedIcon className="unchecked-icon" />
                    )}
                  </div>

                  <input
                    type="radio"
                    id={m.id}
                    value={m.value}
                    name="paymentMethod"
                    checked={isSelected}
                    onChange={(e) => setMethod(e.target.value)}
                    className="sr-only"
                  />
                </div>
              );
            })}
          </div>

          <button className="submit-btn payment-continue-btn" type="submit">
            <span>Continue to Order Review</span>
            <ArrowForwardIcon fontSize="small" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethod;
