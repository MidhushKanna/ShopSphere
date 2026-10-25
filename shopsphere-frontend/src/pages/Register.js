import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions/UserAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "../styles/Register.css";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();

  const registerHandler = (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      setPassError("Passwords do not match. Please re-enter.");
    } else {
      setPassError("");
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        <form className="form auth-form" onSubmit={registerHandler}>
          <div className="auth-header-block">
            <div className="auth-icon-circle">
              <PersonAddOutlinedIcon />
            </div>
            <h1>Create Account</h1>
            <p>Join ShopSphere for seamless shopping & fast deliveries</p>
          </div>

          {loading && <LoadingBox text="Creating your account..." />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}
          {passError && <MessageBox variant="danger">{passError}</MessageBox>}

          <div className="form-ip-sec">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Alex Sharma"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-ip-sec">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-ip-sec">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-ip-sec">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              type="password"
              id="confirmpassword"
              placeholder="Re-enter password"
              required
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="submit-btn auth-submit-btn" type="submit" disabled={loading}>
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowForwardIcon fontSize="small" />
          </button>

          <div className="auth-footer-redirect">
            <span>Already have an account?</span>
            <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
