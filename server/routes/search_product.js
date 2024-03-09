const express = require('express');
const pool = require("../database/db");
const search_product = express.Router();

//search products
search_product.get('/', async (req, res) => {
  try {
    const { productName, productCategory, minPrice, maxPrice, minRate, maxRate } = req.query;

    let query = 'SELECT p.* FROM product p where 1=1';

    if (productName) {
      query += ` AND p.product_name ILIKE '%${productName}%'`;
    }
    if (productCategory) {
      query += ` AND p.product_category ILIKE '%${productCategory}%'`;
    }
    if (minPrice) {
      query += ` AND p.price >= ${minPrice}`;
    }
    if (maxPrice) {
      query += ` AND p.price <= ${maxPrice}`;
    }
    if (minRate) {
      query += ` AND p.overall_rating >= ${minRate}`;
    }
    if (maxRate) {
      query += ` AND p.overall_rating <= ${maxRate}`;
    }
    

    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = search_product;
