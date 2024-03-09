import React, { Fragment, useEffect, useState } from "react";
import "./AllProducts.css"; // Import CSS file for styling
import Card from "./Card"; // Import Card component

const All_products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/product/all_products"//available products
      );
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
        {" "}
        {products.map((product) => (
          <Card
            key={product.product_id}
            productId={product.product_id} // Pass productId as prop
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

export default All_products;
