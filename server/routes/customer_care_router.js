//................ by Prachu...............
const express = require("express");
const customer_care_router = express.Router();
const db = require("../database/db"); // Import your database connection module

// Route to get the total number of products ordered by each customer
customer_care_router.get("/customer_order_history", async (req, res) => {
  try {
    const result = await db.query(`SELECT  
    CONCAT(u.First_Name, ' ', COALESCE(u.Middle_Name, ''), ' ', u.Last_Name) AS customer_name,
    COALESCE(get_total_products_ordered(cus.user_id), 0) AS total_products_ordered
FROM 
    customer cus
JOIN
    Users u ON cus.user_id = u.user_id
ORDER BY 
    total_products_ordered DESC;
`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching total products ordered by customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get the top-sold products
customer_care_router.get("/top_selled", async (req, res) => {
  try {
    // Call the procedure
    await db.query("CALL INSERT_INTO_TOP_SELLED()"); // Call the stored procedure to update Top_Selled table
    const result = await db.query(
      "select distinct product_id,product_name, selled_quantity from top_selled order by selled_quantity desc"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching top-sold products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//TO INSERT INTO TOP_SOLD_BETWEEN_DATES ....................................
customer_care_router.post('/top_sold_between_dates', async (req, res) => {
  const { start_date, end_date } = req.body;
  try {
    // Call the procedure
    await db.query('CALL INSERT_INTO_TOP_SOLD_BETWEEN_DATES($1, $2)', [start_date, end_date]);
    const result = await db.query('SELECT * FROM TOP_SOLD_BETWEEN_DATES ORDER BY selled_quantity DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error inserting data into TOP_SOLD_BETWEEN_DATES:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TO INSERT INTO TOP_SELLER BETWEEN DATES...................................
customer_care_router.post('/top_seller_btwn_dates', async (req, res) => {
  const { start_date, end_date } = req.body;
  try {
    // Call the procedure
    await db.query('CALL INSERT_INTO_TOP_SELLER_BTWN_DATES($1, $2)', [start_date, end_date]);
    const result = await db.query('SELECT * FROM TOP_SELLER_BTWN_DATES ORDER BY sold_quantity DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error inserting data into TOP_SOLD_BETWEEN_DATES:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = customer_care_router;
