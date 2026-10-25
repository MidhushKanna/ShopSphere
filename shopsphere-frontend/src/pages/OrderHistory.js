import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listOrderMine } from "../actions/OrderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "../styles/OrderHistory.css";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import { formatPrice } from "../utils/formatPrice";

const OrderHistory = (props) => {
  const dispatch = useDispatch();
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;

  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);

  return (
    <div className="order-history-page-container">
      <div className="history-header-block">
        <div className="history-icon-bubble">
          <ReceiptOutlinedIcon />
        </div>
        <div>
          <h1 className="history-title">My Orders</h1>
          <p className="history-subtitle">
            View details, payment status, and track delivery for all past purchases.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingBox text="Loading your purchase history..." />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : !orders || orders.length === 0 ? (
        <div className="empty-history-box">
          <div className="empty-icon-circle">
            <ReceiptOutlinedIcon />
          </div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders with ShopSphere yet.</p>
          <Link to="/" className="start-shopping-btn">
            <span>Discover Products</span>
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </div>
      ) : (
        <div className="order-table-responsive-wrapper">
          <table className="table modern-order-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>FULFILLMENT</th>
                <th className="action-col-header">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id-cell">
                    <span className="order-id-code">#{order._id.substring(0, 10)}...</span>
                  </td>
                  <td className="date-cell">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "—"}
                  </td>
                  <td className="price-cell">
                    {formatPrice(order.totalPrice, 2)}
                  </td>
                  <td>
                    {order.isPaid ? (
                      <span className="status-badge badge-success">
                        <CheckCircleOutlineIcon fontSize="small" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="status-badge badge-pending">
                        <AccessTimeOutlinedIcon fontSize="small" />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className="status-badge badge-success">
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
                  <td className="action-col-cell">
                    <button
                      type="button"
                      className="view-order-pill-btn"
                      onClick={() => props.history.push(`/order/${order._id}`)}
                    >
                      <span>Details</span>
                      <ArrowForwardIcon fontSize="small" />
                    </button>
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

export default OrderHistory;
