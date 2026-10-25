import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signin } from "../actions/UserAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "../styles/SignIn.css";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";

const SignIn = (props) => {
  const [role, setRole] = useState("customer"); // "customer" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin@gmail.com");
      setPassword("admin123");
    } else {
      if (email === "admin@gmail.com") {
        setEmail("");
        setPassword("");
      }
    }
  };

  const signInHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password, role));
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin && role === "admin" && redirect === "/") {
        props.history.push("/orderlist");
      } else {
        props.history.push(redirect);
      }
    }
  }, [props.history, redirect, userInfo, role]);

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        <form className="form auth-form" onSubmit={signInHandler}>
          {/* Role selector segmented tabs */}
          <div className="auth-role-tabs" role="tablist">
            <button
              type="button"
              className={`role-tab-btn ${role === "customer" ? "active" : ""}`}
              onClick={() => handleRoleChange("customer")}
              role="tab"
              aria-selected={role === "customer"}
            >
              <PersonOutlineIcon fontSize="small" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              className={`role-tab-btn ${role === "admin" ? "active admin-active" : ""}`}
              onClick={() => handleRoleChange("admin")}
              role="tab"
              aria-selected={role === "admin"}
            >
              <SupervisorAccountOutlinedIcon fontSize="small" />
              <span>Admin</span>
            </button>
          </div>

          <div className="auth-header-block">
            <div className={`auth-icon-circle ${role === "admin" ? "admin-circle" : ""}`}>
              {role === "admin" ? (
                <SupervisorAccountOutlinedIcon />
              ) : (
                <LockOutlinedIcon />
              )}
            </div>
            <h1>{role === "admin" ? "Admin Portal" : "Welcome Back"}</h1>
            <p>
              {role === "admin"
                ? "Sign in with administrator privileges to manage store orders & products"
                : "Sign in to access your ShopSphere account & orders"}
            </p>
          </div>

          {loading && <LoadingBox text={role === "admin" ? "Verifying admin access..." : "Signing in..."} />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}

          {role === "admin" && (
            <div className="admin-credentials-hint">
              <div className="hint-header">
                <VpnKeyOutlinedIcon fontSize="small" />
                <span>Admin Credentials Pre-filled:</span>
              </div>
              <div className="hint-details">
                <code>admin@gmail.com</code> / <code>admin123</code>
              </div>
            </div>
          )}

          <div className="form-ip-sec">
            <label htmlFor="email">
              {role === "admin" ? "Admin Email Address" : "Email Address"}
            </label>
            <input
              type="email"
              id="email"
              placeholder={role === "admin" ? "admin@gmail.com" : "name@example.com"}
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
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className={`submit-btn auth-submit-btn ${role === "admin" ? "admin-submit-btn" : ""}`}
            type="submit"
            disabled={loading}
          >
            <span>
              {loading
                ? "Signing in..."
                : role === "admin"
                ? "Sign In to Admin Console"
                : "Sign In"}
            </span>
            <ArrowForwardIcon fontSize="small" />
          </button>

          {role === "customer" && (
            <div className="auth-footer-redirect">
              <span>New to ShopSphere?</span>
              <Link to={`/register?redirect=${redirect}`}>
                Create an account
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
