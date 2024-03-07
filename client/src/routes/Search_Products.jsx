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
      const response = await fetch(`http://localhost:5000/search_product?productName=${productName}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
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
