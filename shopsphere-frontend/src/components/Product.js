import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Rating from "./Rating";
import { addToCart } from "../actions/CartAction";
import "../styles/Product.css";
import { formatPrice } from "../utils/formatPrice";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CheckIcon from "@material-ui/icons/Check";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [added, setAdded] = useState(false);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      dispatch(addToCart(product._id, 1));
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/product/${product._id}`} className="product-card-link">
        <div className="product-image-container">
          {/* Badge */}
          {isOutOfStock ? (
            <span className="stock-tag tag-out">Sold Out</span>
          ) : isLowStock ? (
            <span className="stock-tag tag-low">Only {product.stock} Left</span>
          ) : (
            <span className="stock-tag tag-in">Featured</span>
          )}

          <div className="product-image-frame">
            <img src={product.image} alt={product.name} loading="lazy" />
          </div>
        </div>

        <div className="product-info-body">
          {product.category && (
            <span className="product-category-meta">{product.category}</span>
          )}
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>

          <div className="product-rating-row">
            <Rating rating={product.rating} numRev={product.numRev} />
          </div>

          <div className="product-price-row">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className="tax-inclusive">Free Delivery</span>
          </div>
        </div>
      </Link>

      <div className="product-action-wrapper">
        {userInfo && userInfo.isAdmin ? (
          <button
            type="button"
            className="card-cart-btn admin-view-card-btn"
            onClick={() => history.push(`/products/product/${product._id}`)}
          >
            <VisibilityOutlinedIcon fontSize="small" />
            <span>View Details</span>
          </button>
        ) : (
          <button
            type="button"
            className={`card-cart-btn ${added ? "added" : ""}`}
            onClick={addToCartHandler}
            disabled={isOutOfStock}
          >
            {added ? (
              <>
                <CheckIcon fontSize="small" />
                <span>Added to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <AddShoppingCartIcon fontSize="small" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
