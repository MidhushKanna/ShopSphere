import React from "react";
import "../styles/MessageBox.css";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";

const MessageBox = (props) => {
  if (!props.children) return null;

  const variant = props.variant || "info";

  const renderIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircleOutlineIcon className="alert-icon" />;
      case "danger":
        return <ErrorOutlineIcon className="alert-icon" />;
      case "warning":
        return <WarningOutlinedIcon className="alert-icon" />;
      default:
        return <InfoOutlinedIcon className="alert-icon" />;
    }
  };

  return (
    <div className={`alert alert-${variant}`} role="alert">
      <div className="alert-icon-wrapper">{renderIcon()}</div>
      <div className="alert-message">{props.children}</div>
    </div>
  );
};

export default MessageBox;
