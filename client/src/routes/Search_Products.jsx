// export default SearchProducts;
import React, { Fragment, useEffect, useState } from "react";
//import "./AllProducts.css"; // Import CSS file for styling
import Card_seller from "./Card_seller";
import  './SearchPage.css';
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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
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

