import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import SecurityOutlinedIcon from "@material-ui/icons/SecurityOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import HeadsetMicOutlinedIcon from "@material-ui/icons/HeadsetMicOutlined";

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Upper Footer Benefits */}
      <div className="footer-benefits-bar">
        <div className="footer-container benefits-grid">
          <div className="benefit-item">
            <LocalShippingOutlinedIcon className="benefit-icon" />
            <div>
              <h5>Free Express Delivery</h5>
              <p>On all orders above ₹499 in India</p>
            </div>
          </div>

          <div className="benefit-item">
            <PaymentOutlinedIcon className="benefit-icon" />
            <div>
              <h5>Instant UPI Payments</h5>
              <p>Scan & pay via GPay, PhonePe, Paytm</p>
            </div>
          </div>

          <div className="benefit-item">
            <SecurityOutlinedIcon className="benefit-icon" />
            <div>
              <h5>100% Genuine Brands</h5>
              <p>Direct manufacturer warranty included</p>
            </div>
          </div>

          <div className="benefit-item">
            <HeadsetMicOutlinedIcon className="benefit-icon" />
            <div>
              <h5>Dedicated Support</h5>
              <p>24/7 customer assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main-links-section">
        <div className="footer-container footer-links-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="logo-symbol">
                <span className="logo-spark"></span>
              </div>
              <span className="logo-text">
                Shop<span className="logo-gradient">Sphere</span>
              </span>
            </Link>
            <p className="footer-brand-desc">
              Your destination for top-tier electronics, powerful ultrabooks,
              immersive gaming displays, and precision tech accessories.
            </p>
          </div>

          {/* Categories Column */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul>
              <li>
                <Link to="/category/laptop">Laptops & Workstations</Link>
              </li>
              <li>
                <Link to="/category/mobile">Smartphones & Tablets</Link>
              </li>
              <li>
                <Link to="/category/monitor">Gaming Monitors</Link>
              </li>
              <li>
                <Link to="/category/accessories">Computer Accessories</Link>
              </li>
              <li>
                <Link to="/category/earphones">Audio & Earphones</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Account & Orders</h4>
            <ul>
              <li>
                <Link to="/cart">View Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orderhistory">Order History</Link>
              </li>
              <li>
                <Link to="/profile">My Account Profile</Link>
              </li>
              <li>
                <Link to="/signin">Customer Sign In</Link>
              </li>
              <li>
                <Link to="/register">Create New Account</Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods Info */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Payment Methods</h4>
            <p className="footer-pay-info">
              We support instant UPI payments via QR code & apps:
            </p>
            <div className="payment-badges-row">
              <span className="pay-badge-chip">PhonePe</span>
              <span className="pay-badge-chip">Google Pay</span>
              <span className="pay-badge-chip">Paytm</span>
              <span className="pay-badge-chip">BHIM UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer Copyright */}
      <div className="footer-bottom-copyright">
        <div className="footer-container bottom-row">
          <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <div className="footer-legal-links">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
