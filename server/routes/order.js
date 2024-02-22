const express = require('express');
const pool = require("../database/db");
const order_router = express.Router();
//insert to order table
order_router.post("/insert_order", async (req, res) => {
    try {
      const {customer_id,product_id,quantity,order_date} = req.body;
      const new_order = await pool.query(
        "INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES ($1,$2,$3,$4) RETURNING *",
        [customer_id,product_id,quantity,order_date]
      );
      res.json(new_order.rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});