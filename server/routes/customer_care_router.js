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

//Arian's code
//Route to get all pending return orders
customer_care_router.get("/pending_return_orders", async (req, res) => {
  try {
    const query = `
      SELECT * FROM Return_Order
      WHERE status = 'pending';
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching pending return orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to approve a return order
customer_care_router.post("/approve", async (req, res) => {
  const { returnOrderId, customerCareId, returnDate } = req.body;

  try {
    // Update the Return_Order table with approval time, customer care ID, and return date
    const query = `
      UPDATE Return_Order
      SET 
        status = 'approved',
        approval_time = CURRENT_TIMESTAMP,
        customer_care_id = $1,
        return_date = $2
      WHERE
        order_id = $3
    `;

    // Execute the query
    await db.query(query, [customerCareId, returnDate, returnOrderId]);

    // Send a success response
    res.status(200).json({ message: "Return order approved successfully" });
  } catch (error) {
    console.error("Error approving return order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

customer_care_router.get("/return_orders_history", async (req, res) => {
  try {
    const query = `
      SELECT * FROM Return_Order
      WHERE status in ('approved','disapproved');
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching pending return orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to approve a return order
customer_care_router.post("/deny", async (req, res) => {
  const { returnOrderId, customerCareId } = req.body;

  try {
    // Update the Return_Order table with approval time, customer care ID, and return date
    const query = `
      UPDATE Return_Order
      SET 
        status = 'disapproved',
        approval_time = CURRENT_TIMESTAMP,
        customer_care_id = $1
      WHERE
        order_id = $2
    `;

    // Execute the query
    await db.query(query, [customerCareId, returnOrderId]);

    // Send a success response
    res.status(200).json({ message: "Return order disapproved successfully" });
  } catch (error) {
    console.error("Error denying return order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = customer_care_router;
