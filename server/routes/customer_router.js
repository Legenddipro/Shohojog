const express = require("express");
const pool = require("../database/db");
const customer_router = express.Router();
// publicRouter.get("/all_products")
customer_router.get("/get_customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
    const { user_id, product_id } = req.body;

    // Check if the user has an unconfirmed order
    const unconfirmedOrderQuery = `
      SELECT order_id FROM "Order" 
      WHERE customer_id = $1 AND isConfirm = false
      LIMIT 1;
    `;
    const unconfirmedOrderResult = await pool.query(unconfirmedOrderQuery, [
      user_id,
    ]);
    let orderId;

    if (unconfirmedOrderResult.rows.length > 0) {
      orderId = unconfirmedOrderResult.rows[0].order_id;
    } else {
      // If no unconfirmed order exists, create a new one
      const insertOrderQuery = `
        INSERT INTO "Order" (order_date, isConfirm, isPaid, customer_id)
        VALUES (CURRENT_DATE, false, false, $1)
        RETURNING order_id;
      `;
      const orderInsertResult = await pool.query(insertOrderQuery, [user_id]);
      orderId = orderInsertResult.rows[0].order_id;
    }

    // Get the available stock for the product
    const stockQuery = `
      SELECT stock FROM Product WHERE product_id = $1;
    `;
    const stockResult = await pool.query(stockQuery, [product_id]);
    const availableStock = stockResult.rows[0].stock;

    // Check if the product already exists in the cart and get its quantity
    const existingProductQuery = `
      SELECT quantity FROM Contains
      WHERE order_id = $1 AND product_id = $2;
    `;
    const existingProductResult = await pool.query(existingProductQuery, [
      orderId,
      product_id,
    ]);
    
    if (existingProductResult.rows.length > 0) {
      // If the product already exists
      const currentQuantity = existingProductResult.rows[0].quantity;
      if (currentQuantity > 0) {
        return res.status(400).json({ error: "Product is already added to cart" });
      }
      // Check if adding 1 more exceeds the available stock
      if (currentQuantity + 1 > availableStock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }
      
      // If adding 1 more doesn't exceed the stock, update quantity and price
      const newQuantity = currentQuantity + 1;
      // Calculate the new price based on the quantity
      const productPriceQuery = `
        SELECT price FROM Product WHERE product_id = $1;
      `;
      const productPriceResult = await pool.query(productPriceQuery, [
        product_id,
      ]);
      const productPrice = productPriceResult.rows[0].price;
      const newPrice = newQuantity * productPrice;

      const updateContainsQuery = `
        UPDATE Contains 
        SET quantity = $1, price = $2
        WHERE order_id = $3 AND product_id = $4;
      `;
      await pool.query(updateContainsQuery, [
        newQuantity,
        newPrice,
        orderId,
        product_id,
      ]);
    } else {
      // If the product doesn't exist, check if there's enough stock to add
      if (1 > availableStock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      // If there's enough stock, insert a new entry
      const insertContainsQuery = `
        INSERT INTO Contains (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, (SELECT price FROM Product WHERE product_id = $2));
      `;
      const quantity = 1; // Assuming default quantity is 1
      await pool.query(insertContainsQuery, [orderId, product_id, quantity]);
    }

    res.json("Product added to cart");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



customer_router.get("/orders/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = `
    SELECT 
    "Order".order_id,
    "Order".order_date,
    "Order".isConfirm,
    Contains.product_id,
    Contains.quantity,
    Contains.price,
    Product.product_name,
    Product.product_category,
    Product.stock
FROM 
    "Order"
JOIN 
    Contains ON "Order".order_id = Contains.order_id
JOIN 
    Product ON Contains.product_id = Product.product_id
WHERE 
    "Order".customer_id = $1
    AND "Order".isConfirm = FALSE
ORDER BY 
    Contains.product_id;

    `;

    const { rows } = await pool.query(query, [userId]);
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

customer_router.post("/update_quantity", async (req, res) => {
  try {
    const { orderId, productId, newQuantity } = req.body;

    // Update the quantity of the product in the Contains table
    const updateQuantityQuery = `
      UPDATE Contains
      SET quantity = $1
      WHERE order_id = $2 AND product_id = $3;
    `;
    await pool.query(updateQuantityQuery, [newQuantity, orderId, productId]);

    // Update the price in the Contains table
    const updatePriceQuery = `
      UPDATE Contains
      SET price = (SELECT price FROM Product WHERE product_id = $2) * quantity
      WHERE order_id = $1 AND product_id = $2;
    `;
    await pool.query(updatePriceQuery, [orderId, productId]);

    res.json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Backend
customer_router.get("/get_cart_quantity", async (req, res) => {
  try {
    const { user_id, product_id } = req.query;

    // Fetch quantity of the specific product in the cart order
    const cartQuantityQuery = `
      SELECT quantity 
      FROM Contains 
      WHERE order_id IN (
        SELECT order_id 
        FROM "Order" 
        WHERE customer_id = $1 AND isConfirm = false
      ) 
      AND product_id = $2;
    `;
    const cartQuantityResult = await pool.query(cartQuantityQuery, [user_id, product_id]);
    const productQuantity = cartQuantityResult.rows.length > 0 ? cartQuantityResult.rows[0].quantity : 0; // Default to 0 if no quantity found

    res.json({ quantity: productQuantity });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = customer_router;
