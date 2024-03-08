//change by Prachu to search by rating ...................................
import React, { Fragment, useState } from "react";
import Card_seller from "./Card_seller";

const SearchProducts = () => {
  // State variables to store search parameters and search results
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  // Function to handle search
  const handleSearch = async () => {
    try {
      // Fetch data from the server based on search parameters
      const response = await fetch(`http://localhost:5000/search_product?productName=${productName}&productCategory=${productCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&minRating=${minRating}&maxRating=${maxRating}`);
      const jsonData = await response.json();
      // Update state with the search results
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      {/* Search input fields */}
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
        <input
          type="number"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max rating"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
        />
        {/* Button to trigger search */}
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display search results */}
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


