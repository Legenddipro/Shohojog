const express = require('express');
const pool = require("../database/db");
const search_product = express.Router();

// Search products
search_product.get('/', async (req, res) => {
  try {
    // Retrieve search parameters from query string
    const { productName, productCategory, minPrice, maxPrice } = req.query;

    // Define base query
    let query = 'SELECT * FROM product WHERE 1=1';

    // Append conditions based on search parameters
    if (productName) {
      query += ` AND product_name ILIKE '%${productName}%'`;
    }
    if (productCategory) {
      query += ` AND product_category ILIKE '%${productCategory}%'`;
    }
    if (minPrice) {
      query += ` AND price >= ${minPrice}`;
    }
    if (maxPrice) {
      query += ` AND price <= ${maxPrice}`;
    }

    // Execute query
    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = search_product;
