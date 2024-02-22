import React, { Fragment, useEffect, useState } from "react";
import "./AllProducts.css"; // Import CSS file for styling
import Card_seller from "./Card_seller";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const id = localStorage.getItem('userId'); // Retrieve id from local storage
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

  console.log(products); // This will log the products array to the console

  return (
    <Fragment>
      <h1>SELLER PRODUCTS</h1>
      <div className="products-container"> {/* Apply CSS styles to this container */}
        {products.map(product => (
          <Card_seller
            key={product.product_id}
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
