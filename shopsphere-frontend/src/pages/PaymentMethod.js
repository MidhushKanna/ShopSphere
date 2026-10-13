import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/CartAction";
import CheckoutSteps from "../components/CheckoutSteps";
import "../styles/PaymentMethod.css";

const METHODS = [
  { id: "phonepe", value: "PhonePe", label: "PhonePe" },
  { id: "gpay", value: "GPay", label: "Google Pay (GPay)" },
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
    <div>
      <CheckoutSteps step1 step2 step3 />

      <div className="pay-method-container">
        <form className="form" onSubmit={submitMethod}>
          <div>
            <h1>Payment Method</h1>
          </div>

          {METHODS.map((m) => (
            <div className="select-method-ip" key={m.id}>
              <input
                type="radio"
                id={m.id}
                value={m.value}
                name="paymentMethod"
                checked={method === m.value}
                onChange={(e) => setMethod(e.target.value)}
                required
              />
              <label htmlFor={m.id}>{m.label}</label>
            </div>
          ))}

          <div>
            <label />
            <button className="submit-btn" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethod;
