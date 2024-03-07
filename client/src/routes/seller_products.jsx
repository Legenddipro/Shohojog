import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllProducts.css"; // Import CSS file for styling
import Card_seller from "./Card_seller";

const SellerProducts = () => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [unavailableProducts, setUnavailableProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId'); // Retrieve id from local storage

    const getAllProducts = async () => {
      try {
        // Fetch available products
        const availableResponse = await fetch(`http://localhost:5000/product/seller_products/${id}`);
        const availableData = await availableResponse.json();
        setAvailableProducts(availableData);

        // Fetch unavailable products
        const unavailableResponse = await fetch(`http://localhost:5000/product/unavailable_products/${id}`);
        const unavailableData = await unavailableResponse.json();
        setUnavailableProducts(unavailableData);
      } catch (err) {
        console.error(err.message);
      }
    };

    getAllProducts();
  }, []);

  const handleGoBack = () => {
    navigate("/Home_seller"); // Navigate to Home_seller page
  };

  return (
    <Fragment>
      {/* Title Bar */}
      <div className="title-bar">
        <h1>SELLER PRODUCTS</h1>
        <Link to="/add_product" className="add-product-link">
          <button className="add-product-button">Add Product</button>
        </Link>
        <div className="navigation">
          <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      {/* Available Products Container */}
      <div className="products-container">
        <h2>Available Products</h2>
        {availableProducts.map(product => (
          <Card_seller
            key={product.product_id}
            productId={product.product_id}
            productName={product.product_name}
            price={product.price}
            category={product.product_category}
            stock={product.stock}
            status={product.status}
            delete_status={product.delete_status}
          />
        ))}
      </div>

      {/* Unavailable Products Container */}
      <div className="products-container">
        <h2>Unavailable Products</h2>
        {unavailableProducts.map(product => (
          <Card_seller
            key={product.product_id}
            productId={product.product_id}
            productName={product.product_name}
            price={product.price}
            category={product.product_category}
            stock={product.stock}
            status={product.status}
            delete_status={product.delete_status}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default SellerProducts;

