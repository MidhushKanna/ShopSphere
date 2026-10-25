import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/ProductList.css";
import Product from "./Product";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";
import { listProducts } from "../actions/ProdcutActions";
import FlareOutlinedIcon from "@material-ui/icons/FlareOutlined";

const ProductList = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <section className="home-product-section">
      <div className="section-header-block">
        <div className="section-badge">
          <FlareOutlinedIcon fontSize="small" />
          <span>Curated Picks</span>
        </div>
        <h2 className="section-title">Explore Featured Tech</h2>
        <p className="section-subtitle">
          Handpicked laptops, smartphones, monitors & gaming accessories at unbeatable prices.
        </p>
      </div>

      {loading ? (
        <LoadingBox text="Loading the latest products..." />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : !products || products.length === 0 ? (
        <div className="empty-catalog-box">
          <p>No products found in the catalog right now.</p>
        </div>
      ) : (
        <div className="products-responsive-grid">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
