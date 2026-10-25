import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/CartAction";
import CheckoutSteps from "../components/CheckoutSteps";
import "../styles/ShippingAddress.css";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const ShippingAddress = (props) => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!userInfo) {
    props.history.push("/signin");
  }

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalcode, setPostalCode] = useState(
    shippingAddress.postalcode || "",
  );
  const [country, setCountry] = useState(shippingAddress.country || "India");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        postalcode,
        country,
      }),
    );

    props.history.push("/payment");
  };

  return (
    <div className="shipping-page-container">
      <CheckoutSteps step1 step2></CheckoutSteps>

      <div className="shipping-card-wrapper">
        <form className="form shipping-form" onSubmit={submitHandler}>
          <div className="form-heading-block">
            <div className="form-icon-pill">
              <LocalShippingOutlinedIcon />
            </div>
            <h1>Shipping Address</h1>
            <p>Where should we deliver your order?</p>
          </div>

          <div className="form-ip-sec">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. Alex Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-ip-sec">
            <label htmlFor="address">Street Address / Flat No.</label>
            <input
              type="text"
              id="address"
              placeholder="e.g. Flat 402, Highline Residency, MG Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-row-duo">
            <div className="form-ip-sec">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-ip-sec">
              <label htmlFor="postalcode">Postal / PIN Code</label>
              <input
                type="text"
                id="postalcode"
                placeholder="e.g. 560001"
                value={postalcode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-ip-sec">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              placeholder="India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="continue-btn">
            <span>Continue to Payment</span>
            <ArrowForwardIcon fontSize="small" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddress;
