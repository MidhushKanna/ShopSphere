import React, { useEffect, useState } from "react";
import "../styles/SearchResults.css";
import { useSelector, useDispatch } from "react-redux";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { listProducts } from "../actions/ProdcutActions";
import PriceCheckBox from "../components/PriceCheckBox";
import { prices } from "../data/priceRanges";
import FilterListIcon from "@material-ui/icons/FilterList";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

const SearchResults = (props) => {
  const [range, setRange] = useState([0, 10000000]);
  const query = props.match.params.query || "";

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const handleFilters = (filters) => {
    const data = prices;
    let array = [0, 10000000];

    for (let key in data) {
      if (data[key].id === parseInt(filters, 10)) {
        array = data[key].array;
      }
    }
    setRange(array);
  };

  const filteredProducts = products
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) &&
          product.price <= range[1] &&
          product.price >= range[0],
      )
    : [];

  return (
    <div className="search-page-container">
      {/* Sidebar Filters */}
      <aside className="filter-options-sidebar">
        <div className="filter-sidebar-header">
          <div className="filter-header-title">
            <FilterListIcon />
            <h3>Filters</h3>
          </div>
          <button
            type="button"
            className="clear-filter-text-btn"
            onClick={() => setRange([0, 10000000])}
            title="Reset price filters"
          >
            <RotateLeftIcon fontSize="small" />
            <span>Reset</span>
          </button>
        </div>

        <div className="filter-category-group">
          <h4 className="filter-group-heading">Price Range</h4>
          <PriceCheckBox
            list={prices}
            handleFilters={(filters) => handleFilters(filters)}
          />
        </div>
      </aside>

      {/* Main Results View */}
      <main className="search-results-main">
        <div className="results-top-header-bar">
          <div>
            <span className="results-query-pill">Search Query</span>
            <h1 className="results-main-title">
              Results for &ldquo;{query}&rdquo;
            </h1>
          </div>
          {!loading && !error && (
            <span className="results-count-badge">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product found" : "products found"}
            </span>
          )}
        </div>

        {loading ? (
          <LoadingBox text="Searching catalog..." />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : filteredProducts.length === 0 ? (
          <div className="no-search-results-box">
            <h3>No products found</h3>
            <p>
              We couldn&rsquo;t find anything matching &ldquo;{query}&rdquo; in this price range. Try checking your spelling or adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="search-product-grid">
            {filteredProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
