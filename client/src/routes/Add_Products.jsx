// Add_Products.jsx
import React, { useState } from "react";
import "./Add_Products.css";
const Add_Products = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState(""); // State for category_id

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get seller ID from local storage
    const sellerId = localStorage.getItem('userId');

    const newProduct = {
      product_name: productName,
      price: parseFloat(price), // Parse price to float
      product_category: category,
      product_features: features,
      seller_id: sellerId,
      category_id: parseInt(categoryId), // Parse category ID to integer
      stock: parseInt(stock) // Parse stock to integer
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
      console.log(data); // Log response from backend
      // Optionally, handle success message or redirect to another page
    } catch (error) {
      console.error('Error:', error);
      // Optionally, handle error message
    }
  };

  return (
    <div className="add-products-container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label>Product Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />

        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

        <label>Features:</label>
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} required />

        <label>Category ID:</label> {/* New input field for category_id */}
        <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />

        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Add_Products;
