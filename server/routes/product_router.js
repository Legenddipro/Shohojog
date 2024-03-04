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
  const { price, product_features, stock } = req.body;

  try {
    const query = `
      UPDATE product 
      SET 
        price = $1, 
        product_features = $2, 
        stock = $3 
      WHERE product_id = $4
    `;

    const values = [price, product_features, stock, productId];
    await pool.query(query, values);

    res.status(200).json({ message: 'Product stock, price, and features updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//ADD PRODUCT BY PRACHU.......................................
// Route to add a new product
product_router.post('/add_product', async (req, res) => {
  const { product_name, price, product_category, product_features, seller_id, category_id, stock } = req.body;

  try {
    // Perform input data validation if required

    // Insert the new product into the database
    const query = `
      INSERT INTO product (product_name, price, product_category, product_features, seller_id, category_id, stock)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [product_name, price, product_category, product_features, seller_id, category_id, stock];
    const newProduct = await pool.query(query, values);

    res.status(201).json(newProduct.rows[0]); // Return the newly added product
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a product
product_router.delete('/delete_product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Begin a transaction to ensure atomicity of operations
    await pool.query('BEGIN');

    // Delete the product from the product table
    await pool.query('DELETE FROM product WHERE product_id = $1', [productId]);

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await pool.query('ROLLBACK');
    
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = product_router;