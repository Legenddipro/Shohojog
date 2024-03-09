import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card_seller from "./Card_seller";
import './SearchPage.css';

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [showRatingRange, setShowRatingRange] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const getAllProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/seller_products/${id}`);
        const jsonData = await response.json();
        setProducts(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };

    getAllProducts();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search_product?productName=${productName}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&minRating=${minRating}&maxRating=${maxRating}`);
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const togglePriceRange = () => {
    setShowPriceRange(!showPriceRange);
  };

  const toggleRatingRange = () => {
    setShowRatingRange(!showRatingRange);
  };

  return (
    <Fragment>
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Search Products</h1>
        </div>
        <div className="navigation">
          <Link to="/Home_seller" className="go-back-button">Go Back</Link>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <div className="filters-container">
        <button onClick={togglePriceRange} className="toggle-price-range-button">
          {showPriceRange ? "Hide Price Range" : "Search by Price Range"}
        </button>
        {showPriceRange && (
          <Fragment>
            <div className="price-filter">
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <span className="arrow-up"></span>
              <span className="arrow-down"></span>
            </div>
            <div className="price-filter">
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
              <span className="arrow-up"></span>
              <span className="arrow-down"></span>
            </div>
          </Fragment>
        )}

        <button onClick={toggleRatingRange} className="toggle-rating-range-button">
          {showRatingRange ? "Hide Rating Range" : "Search by Rating Range"}
        </button>
        {showRatingRange && (
          <Fragment>
            <div className="rating-filter">
              <input
                type="number"
                placeholder="Min rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="rating-input"
              />
              <span className="arrow-up"></span>
              <span className="arrow-down"></span>
            </div>
            <div className="rating-filter">
              <input
                type="number"
                placeholder="Max rating"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
                className="rating-input"
              />
              <span className="arrow-up"></span>
              <span className="arrow-down"></span>
            </div>
          </Fragment>
        )}
      </div>

      <div className="products-container">
        {products.map(product => (
          <Card_seller
            key={product.product_id}
            productId={product.product_id}
            productName={product.product_name}
            price={product.price}
            category={product.product_category}
            stock={product.stock}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default SearchProducts;
