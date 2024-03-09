import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import "./Add_Products.css";

const Add_Products = () => {
  const navigate = useNavigate(); 
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerId = localStorage.getItem('userId');

    const newProduct = {
      product_name: productName,
      price: parseFloat(price), 
      product_category: category,
      product_features: features,
      seller_id: sellerId,
      stock: parseInt(stock) 
    };

    try {
      const response = await fetch('http://localhost:5000/product/add_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      const data = await response.json();
      console.log(data); 
      
      navigate('/seller-products');
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  return (
    <div className="add-products-container">
      {/* Title Bar */}
      <div className="title-bar">
        <h1 className="title">Shohojog</h1>
        <Link to="/seller-products" className="go-back-button">Go Back</Link>
      </div>

      {/* Form */}
      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Product Name:</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />

          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <label>Features:</label>
          <textarea value={features} onChange={(e) => setFeatures(e.target.value)} required />

          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default Add_Products;
