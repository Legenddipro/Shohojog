const express = require('express');
const pool = require("../database/db");
const seller_router = express.Router();
// publicRouter.get("/all_products")
seller_router.get("/getSeller/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const get_seller = await pool.query(
        "SELECT * FROM seller where user_id = $1",
        [id]
      );
      res.json(get_seller.rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = seller_router;