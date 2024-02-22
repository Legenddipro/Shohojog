import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // Ensure that 'id' is correctly retrieved from the URL params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/getSingleProduct/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const jsonData = await response.json();
        setProduct(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      <h2>Product Details</h2>
      {product && (
        <div>
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