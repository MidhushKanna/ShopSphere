import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { addToCart } from "../actions/CartAction";
import "../styles/Product.css";
import { formatPrice } from "../utils/formatPrice";

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product._id, 1));
  };

  return (
    <div className="product-card">
      <Link to={`/products/product/${product._id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <h2>{product.name}</h2>

        <Rating rating={product.rating} numRev={product.numRev} />

        <p>{formatPrice(product.price)}</p>
      </Link>

      <button
        type="button"
        onClick={addToCartHandler}
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default Product;
