import React from "react";
import "../styles/LoadingBox.css";

const LoadingBox = ({ text = "Loading..." }) => {
  return (
    <div className="loading-box" aria-label="Loading content">
      <div className="spinner-ring">
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingBox;
