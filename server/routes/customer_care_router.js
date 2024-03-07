//................ by Prachu...............
const express = require('express');
const customer_care_router = express.Router();
const db = require('../database/db'); // Import your database connection module

// Route to get the total number of products ordered by each customer
customer_care_router.get('/customer_order_history', async (req, res) => {
  try {
    const result = await db.query('SELECT cus.user_id, get_total_products_ordered(cus.user_id) AS total_products_ordered FROM customer cus ORDER BY total_products_ordered DESC ');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching total products ordered by customer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get the top-sold products
customer_care_router.get('/top_selled', async (req, res) => {
  try {
    // Call the procedure
    await db.query('CALL INSERT_INTO_TOP_SELLED()'); // Call the stored procedure to update Top_Selled table
    const result = await db.query('select distinct product_id,product_name, selled_quantity from top_selled order by selled_quantity desc');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top-sold products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = customer_care_router;