import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deliverOrder, listOrders } from "../../actions/OrderAction";
import { signout } from "../../actions/UserAction";
import { ORDER_DELIVER_RESET } from "../../constants/OrderConstant";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { formatPrice } from "../../utils/formatPrice";
import "../../styles/AdminOrders.css";

import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const OrderList = (props) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;

  useEffect(() => {
    if (successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
    }
    dispatch(listOrders());
  }, [dispatch, successDeliver]);

  const deliverHandler = (order) => {
    if (window.confirm(`Mark order #${order._id.substring(0, 8)} as delivered?${order.paymentMethod === 'Cash on Delivery' ? ' (This will also mark Cash on Delivery as paid)' : ''}`)) {
      dispatch(deliverOrder(order._id));
    }
  };

  const filteredOrders = (orders || []).filter((order) => {
    // Status filter
    if (filterStatus === "paid" && !order.isPaid) return false;
    if (filterStatus === "unpaid" && order.isPaid) return false;
    if (filterStatus === "delivered" && !order.isDelivered) return false;
    if (filterStatus === "pending_delivery" && order.isDelivered) return false;
    if (filterStatus === "cod" && order.paymentMethod !== "Cash on Delivery") return false;

    // Search filter (Order ID, Customer Name, Customer Email)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const orderIdMatch = order._id.toLowerCase().includes(term);
      const nameMatch = order.user && order.user.name && order.user.name.toLowerCase().includes(term);
      const emailMatch = order.user && order.user.email && order.user.email.toLowerCase().includes(term);
      return orderIdMatch || nameMatch || emailMatch;
    }

    return true;
  });

  const totalRevenue = (orders || [])
    .filter((o) => o.isPaid)
    .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const pendingDeliveryCount = (orders || []).filter((o) => !o.isDelivered).length;

  return (
    <div className="admin-orders-page-container">
      {/* Header Banner */}
      <div className="admin-orders-header-banner">
        <div className="admin-orders-header-content">
          <div className="admin-header-badge-row">
            <div className="admin-badge-pill">
              <SupervisorAccountOutlinedIcon fontSize="small" />
              <span>Admin Console</span>
            </div>
            <button
              type="button"
              className="admin-header-signout-btn"
              onClick={() => {
                dispatch(signout());
                props.history.push("/signin");
              }}
              title="Sign Out from Admin"
            >
              <ExitToAppIcon fontSize="small" />
              <span>Sign Out</span>
            </button>
          </div>
          <h1>Customer Orders Management</h1>
          <p>
            Monitor live customer purchases, verify payments, track Cash on Delivery orders, and dispatch shipments.
          </p>
        </div>

        {/* Quick Stats Cards */}
        {orders && (
          <div className="admin-stats-summary-grid">
            <div className="admin-stat-card">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="admin-stat-card highlight">
              <span className="stat-label">Pending Delivery</span>
              <span className="stat-value">{pendingDeliveryCount}</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Total Paid Revenue</span>
              <span className="stat-value revenue">{formatPrice(totalRevenue, 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action and Filter Toolbar */}
      <div className="admin-orders-toolbar">
        <div className="admin-search-wrapper">
          <SearchIcon className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by customer name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tab-buttons">
          <button
            type="button"
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({orders ? orders.length : 0})
          </button>
          <button
            type="button"
            className={`filter-tab ${filterStatus === "pending_delivery" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending_delivery")}
          >
            Pending Delivery ({orders ? orders.filter((o) => !o.isDelivered).length : 0})
          </button>
          <button
            type="button"
            className={`filter-tab ${filterStatus === "cod" ? "active" : ""}`}
            onClick={() => setFilterStatus("cod")}
          >
            Cash on Delivery ({orders ? orders.filter((o) => o.paymentMethod === "Cash on Delivery").length : 0})
          </button>
          <button
            type="button"
            className={`filter-tab ${filterStatus === "delivered" ? "active" : ""}`}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered ({orders ? orders.filter((o) => o.isDelivered).length : 0})
          </button>
        </div>
      </div>

      {loadingDeliver && <LoadingBox text="Updating delivery status..." />}
      {errorDeliver && <MessageBox variant="danger">{errorDeliver}</MessageBox>}

      {loading ? (
        <LoadingBox text="Fetching customer orders..." />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-admin-orders-box">
          <div className="empty-icon-circle">
            <ReceiptOutlinedIcon />
          </div>
          <h3>No Orders Found</h3>
          <p>No orders match the current filter criteria.</p>
        </div>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>METHOD</th>
                <th>PAYMENT</th>
                <th>DELIVERY</th>
                <th className="actions-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  {/* Order ID */}
                  <td className="order-id-cell">
                    <Link to={`/order/${order._id}`} className="order-id-link">
                      #{order._id.substring(0, 10)}...
                    </Link>
                  </td>

                  {/* Customer Info */}
                  <td className="customer-cell">
                    <div className="customer-info-box">
                      <span className="customer-name">
                        {order.user ? order.user.name : "Guest Customer"}
                      </span>
                      <span className="customer-email">
                        {order.user ? order.user.email : "No email"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="date-cell">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                  </td>

                  {/* Total */}
                  <td className="price-cell">
                    {formatPrice(order.totalPrice, 2)}
                  </td>

                  {/* Payment Method */}
                  <td>
                    <span
                      className={`method-chip ${
                        order.paymentMethod === "Cash on Delivery"
                          ? "chip-cod"
                          : "chip-upi"
                      }`}
                    >
                      {order.paymentMethod === "Cash on Delivery" ? "COD" : order.paymentMethod}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td>
                    {order.isPaid ? (
                      <span className="status-badge badge-success" title={`Paid on ${order.paidAt}`}>
                        <CheckCircleOutlineIcon fontSize="small" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="status-badge badge-pending">
                        <AccessTimeOutlinedIcon fontSize="small" />
                        <span>{order.paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Unpaid"}</span>
                      </span>
                    )}
                  </td>

                  {/* Delivery Status */}
                  <td>
                    {order.isDelivered ? (
                      <span className="status-badge badge-success" title={`Delivered on ${order.deliveredAt}`}>
                        <CheckCircleOutlineIcon fontSize="small" />
                        <span>Delivered</span>
                      </span>
                    ) : (
                      <span className="status-badge badge-neutral">
                        <LocalShippingOutlinedIcon fontSize="small" />
                        <span>Processing</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="actions-cell">
                    <div className="actions-btn-group">
                      <button
                        type="button"
                        className="admin-action-btn view-btn"
                        onClick={() => props.history.push(`/order/${order._id}`)}
                        title="View Full Order Details"
                      >
                        <span>Details</span>
                        <ArrowForwardIcon fontSize="small" />
                      </button>

                      {!order.isDelivered && (
                        <button
                          type="button"
                          className="admin-action-btn deliver-btn"
                          onClick={() => deliverHandler(order)}
                          title="Mark Order as Delivered"
                          disabled={loadingDeliver}
                        >
                          <LocalShippingOutlinedIcon fontSize="small" />
                          <span>Deliver</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
