import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllProducts.css"; // Import CSS file for styling
import Card_seller from "./Card_seller";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId'); // Retrieve id from local storage
    const getAllProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/seller_products/${id}`);
        const jsonData = await response.json();
        console.log("Fetched products:", jsonData);
        setProducts(jsonData);
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
        <div className="navigation">
          <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      {/* Add Product Button */}
      <button className="card__btn card__btn--add-product">
        <Link to="/add_product" className="card__btn--add-product">
          Add Product
        </Link>
      </button>

      {/* Products Container */}
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

export default SellerProducts;

