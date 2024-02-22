const express = require('express');
const pool = require("../database/db");
const customer_router = express.Router();
// publicRouter.get("/all_products")
customer_router.get("/get_customer/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const get_customer = await pool.query(
        "SELECT * FROM users where user_id = $1",
        [id]
      );
      res.json(get_customer.rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
customer_router.post("/add_to_cart", async (req, res) => {
  try {
    const { user_id, product_id} = req.params;
    
    res.json("Product added to cart");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = customer_router;