import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signout } from "../actions/UserAction";
import "../styles/Header.css";

import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ClearIcon from "@material-ui/icons/Clear";

const CATEGORIES = [
  { path: "/", label: "All Items", icon: "🔥" },
  { path: "/category/mobile", label: "Mobiles", icon: "📱" },
  { path: "/category/laptop", label: "Laptops", icon: "💻" },
  { path: "/category/monitor", label: "Monitors", icon: "🖥️" },
  { path: "/category/accessories", label: "Accessories", icon: "⌨️" },
  { path: "/category/earphones", label: "Audio & Earphones", icon: "🎧" },
];

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [dropdown, setDropDown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const signOutHandler = () => {
    dispatch(signout());
    setDropDown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      history.push(`/searchresults/${encodeURIComponent(query.trim())}`);
    }
  };

  // Close dropdowns on route changes
  useEffect(() => {
    setDropDown(false);
    setAdminDropdown(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      {/* Top micro announcement bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>✨ <strong>Special Offer:</strong> Free Express Delivery on orders above ₹499 | Instant UPI Checkout</span>
          <span className="announcement-badge">Fast & Secure</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="main-nav-wrapper">
        <div className="header-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="ShopSphere Home">
            <div className="logo-symbol">
              <span className="logo-spark"></span>
            </div>
            <span className="logo-text">
              Shop<span className="logo-gradient">Sphere</span>
            </span>
          </Link>

          {/* Search Bar Form */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <SearchIcon className="search-form-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search products, brands, gear..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* User Nav Actions */}
          <div className="nav-actions">
            {/* Cart Link for Customers Only */}
            {(!userInfo || !userInfo.isAdmin) && (
              <Link to="/cart" className="action-pill cart-pill" aria-label="Shopping Cart">
                <div className="cart-icon-wrapper">
                  <ShoppingCartOutlinedIcon className="action-icon" />
                  {totalCartCount > 0 && (
                    <span className="cart-badge-count">{totalCartCount}</span>
                  )}
                </div>
                <span className="cart-label">Cart</span>
              </Link>
            )}

            {/* Quick Orders shortcut for Admins */}
            {userInfo && userInfo.isAdmin && (
              <Link to="/orderlist" className="action-pill cart-pill" aria-label="Manage Orders" title="Customer Orders Management">
                <ReceiptOutlinedIcon className="action-icon" />
                <span className="cart-label">Orders</span>
              </Link>
            )}

            {/* User Account Menu */}
            {userInfo ? (
              <div className="menu-dropdown-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className={`user-profile-btn ${dropdown ? "active" : ""}`}
                  onClick={() => setDropDown(!dropdown)}
                  aria-expanded={dropdown}
                >
                  <div className="user-avatar-initial">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="user-firstname">{userInfo.name.split(" ")[0]}</span>
                  <KeyboardArrowDownIcon className={`chevron-icon ${dropdown ? "rotate" : ""}`} />
                </button>

                {dropdown && (
                  <div className="dropdown-panel animate-pop">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{userInfo.name}</p>
                      <p className="dropdown-user-email">{userInfo.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      <PersonOutlineIcon className="item-icon" />
                      <span>My Profile</span>
                    </Link>
                    {!userInfo.isAdmin ? (
                      <Link to="/orderhistory" className="dropdown-item">
                        <ReceiptOutlinedIcon className="item-icon" />
                        <span>Order History</span>
                      </Link>
                    ) : (
                      <Link to="/orderlist" className="dropdown-item">
                        <ReceiptOutlinedIcon className="item-icon" />
                        <span>Manage Orders</span>
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button type="button" onClick={signOutHandler} className="dropdown-item signout-item">
                      <ExitToAppIcon className="item-icon" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="action-pill signin-pill">
                <AccountCircleOutlinedIcon className="action-icon" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Menu (if admin) */}
            {userInfo && userInfo.isAdmin && (
              <div className="menu-dropdown-wrapper" ref={adminDropdownRef}>
                <button
                  type="button"
                  className={`admin-badge-btn ${adminDropdown ? "active" : ""}`}
                  onClick={() => setAdminDropdown(!adminDropdown)}
                  aria-expanded={adminDropdown}
                >
                  <DashboardOutlinedIcon className="action-icon" />
                  <span>Admin</span>
                  <KeyboardArrowDownIcon className={`chevron-icon ${adminDropdown ? "rotate" : ""}`} />
                </button>

                {adminDropdown && (
                  <div className="dropdown-panel animate-pop">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">Store Admin</p>
                      <p className="dropdown-user-email">Management Tools</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/productlist" className="dropdown-item">
                      <DashboardOutlinedIcon className="item-icon" />
                      <span>Manage Products</span>
                    </Link>
                    <Link to="/orderlist" className="dropdown-item">
                      <ReceiptOutlinedIcon className="item-icon" />
                      <span>Manage Orders</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button type="button" onClick={signOutHandler} className="dropdown-item signout-item">
                      <ExitToAppIcon className="item-icon" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sleek Category Navigation Chips */}
      <nav className="category-nav-bar" aria-label="Categories">
        <div className="category-nav-container">
          <ul className="category-chips-list">
            {CATEGORIES.map((cat) => {
              const isActive = location.pathname === cat.path;
              return (
                <li key={cat.path}>
                  <Link
                    to={cat.path}
                    className={`category-chip ${isActive ? "active" : ""}`}
                  >
                    <span className="chip-icon">{cat.icon}</span>
                    <span className="chip-label">{cat.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
