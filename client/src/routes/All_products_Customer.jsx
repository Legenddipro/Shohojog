import React, { Fragment, useEffect, useState } from "react";
import "./AllProducts.css";
import Customer_Card from "./Customer_Card";

const All_products_Customer = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product/all_products");
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  console.log(products); 

  return (
    <Fragment>
      <div className="products-container"> 
        {products.map(product => (
          <Customer_Card
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

export default All_products_Customer;
