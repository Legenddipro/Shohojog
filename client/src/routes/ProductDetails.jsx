// ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css"; // Import the CSS file for styling

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/getSingleProduct/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const jsonData = await response.json();
        setProduct(jsonData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product data');
        setLoading(false);
        console.error(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading-text">Loading...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div className="product-details-container">
      <h2 className="product-details-heading">Product Details</h2>
      {product && (
        <div className="product-info">
          <p>Product Name: {product.product_name}</p>
          <p>Price: {product.price}</p>
          <p>Category: {product.product_category}</p>
          <p>Features: {product.product_features}</p>
          <p>Stock: {product.stock}</p>
          {/* Add more details here */}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
