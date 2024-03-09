const express = require('express');
const pool = require("../database/db");

const search_product_with_order = express.Router();
// Search products with specific order ID and additional parameters
search_product_with_order.get('/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
  
      const { productName, minPrice, maxPrice, minRate, maxRate } = req.query;
  
      let query = `
        SELECT p.*
        FROM product p
        INNER JOIN Contains c ON p.product_id = c.product_id
        WHERE c.order_id = $1`;
  
      const queryParams = [orderId];
  
      if (productName) {
        query += ` AND p.product_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${productName}%`);
      }
  
      if (minPrice) {
        query += ` AND p.price >= $${queryParams.length + 1}`;
        queryParams.push(minPrice);
      }
  
      if (maxPrice) {
        query += ` AND p.price <= $${queryParams.length + 1}`;
        queryParams.push(maxPrice);
      }
  
      if (minRate) {
        query += ` AND p.overall_rating >= $${queryParams.length + 1}`;
        queryParams.push(minRate);
      }
  
      if (maxRate) {
        query += ` AND p.overall_rating <= $${queryParams.length + 1}`;
        queryParams.push(maxRate);
      }
  
      const results = await pool.query(query, queryParams);
      res.json(results.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = search_product_with_order;