const express = require('express');
const pool = require("../database/db");
const product_router = express.Router();
// publicRouter.get("/all_products")
//TO GET ALL PRODUCTS 
product_router.get("/all_products", async (req, res) => {
    try {
      const all_products = await pool.query("SELECT * FROM product where stock >= 0");
      res.json(all_products.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  //GET SINGLE PRODUCTS
  product_router.get("/getSingleProduct/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const get_single_product = await pool.query(
        "SELECT * FROM product where product_id = $1",
        [id]
      );
      res.json(get_single_product.rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
//seller products
product_router.get("/seller_products/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const seller_products = await pool.query("SELECT * FROM product where seller_id = $1",[id]);
    res.json(seller_products.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// Route to update product status, price, and features
product_router.put('/edit_product/:id', async (req, res) => {
  const productId = req.params.id;
  const { price, product_features, status } = req.body;

  try {
    const query = `
      UPDATE product 
      SET 
        price = $1, 
        product_features = $2, 
        status = $3 
      WHERE product_id = $4
    `;

    const values = [price, product_features, status, productId];
    await pool.query(query, values);

    res.status(200).json({ message: 'Product status, price, and features updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  module.exports = product_router;