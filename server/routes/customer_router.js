const express = require("express");
const pool = require("../database/db");
const customer_router = express.Router();

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
        return res
          .status(400)
          .json({ error: "Product is already added to cart" });
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
    const cartQuantityResult = await pool.query(cartQuantityQuery, [
      user_id,
      product_id,
    ]);
    const productQuantity =
      cartQuantityResult.rows.length > 0
        ? cartQuantityResult.rows[0].quantity
        : 0; // Default to 0 if no quantity found

    res.json({ quantity: productQuantity });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Route to remove a product from the cart
customer_router.post("/remove_from_cart", async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Find the order_id where user_id is not confirmed (isConfirm = false)
    const findOrderIdQuery =
      'SELECT order_id FROM "Order" WHERE customer_id = $1 AND isConfirm = false';
    const { rows } = await pool.query(findOrderIdQuery, [user_id]);

    if (rows.length === 0) {
      // If no unconfirmed order is found, send error response
      return res.status(400).json({ error: "Cart is Empty" });
    }

    const order_id = rows[0].order_id;

    // Check if there are multiple entries of the same order_id in Contains table
    const checkMultipleEntriesQuery =
      "SELECT COUNT(*) AS count FROM Contains WHERE order_id = $1";
    const countResult = await pool.query(checkMultipleEntriesQuery, [order_id]);

    if (countResult.rows[0].count > 1) {
      // If there are multiple entries, delete only the specified product from Contains table
      const deleteProductQuery =
        "DELETE FROM Contains WHERE order_id = $1 AND product_id = $2";
      await pool.query(deleteProductQuery, [order_id, product_id]);
    } else {
      // If there's only one entry, delete both from Contains and Order table
      const deleteContainsQuery = "DELETE FROM Contains WHERE order_id = $1";
      await pool.query(deleteContainsQuery, [order_id]);

      const deleteOrderQuery = 'DELETE FROM "Order" WHERE order_id = $1';
      await pool.query(deleteOrderQuery, [order_id]);
    }

    // Send success response
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

//route receipt page
customer_router.get("/receipt/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the unconfirmed order details for the user
    const unconfirmedOrderQuery = `
      SELECT order_id
      FROM "Order"
      WHERE customer_id = $1 AND isConfirm = false
      LIMIT 1;
    `;
    const unconfirmedOrderResult = await pool.query(unconfirmedOrderQuery, [
      userId,
    ]);

    if (unconfirmedOrderResult.rows.length === 0) {
      return res.status(404).json({ error: "No unconfirmed orders found" });
    }

    const orderId = unconfirmedOrderResult.rows[0].order_id;

    // Fetch product details for the unconfirmed order
    const productDetailsQuery = `
      SELECT 
        Product.product_name,
        Product.product_category,
        Seller.company_name,
        Contains.quantity,
        Contains.price
      FROM 
        Contains
      INNER JOIN 
        Product ON Contains.product_id = Product.product_id
      INNER JOIN 
        Seller ON Product.seller_id = Seller.user_id
      WHERE 
        Contains.order_id = $1;
    `;
    const productDetailsResult = await pool.query(productDetailsQuery, [
      orderId,
    ]);

    // Prepare receipt data
    const receipt = {
      order_id: orderId,
      products: productDetailsResult.rows,
      total_price: productDetailsResult.rows.reduce(
        (acc, product) => acc + parseFloat(product.price),
        0
      ),
    };

    res.json(receipt);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
  //cancel cart
  customer_router.post("/cancel_cart", async (req, res) => {
    try {
      const { user_id } = req.body;

      // Find the order_id where user_id is not confirmed (isConfirm = false)
      const findOrderIdQuery =
        'SELECT order_id FROM "Order" WHERE customer_id = $1 AND isConfirm = false';
      const { rows } = await pool.query(findOrderIdQuery, [user_id]);

      if (rows.length === 0) {
        // If no unconfirmed order is found, send error response
        return res.status(400).json({ error: "Cart is Empty" });
      }

      const order_id = rows[0].order_id;

      // Delete all entries from Contains table
      const deleteContainsQuery = "DELETE FROM Contains WHERE order_id = $1";
      await pool.query(deleteContainsQuery, [order_id]);

      // Delete the order from Order table
      const deleteOrderQuery = 'DELETE FROM "Order" WHERE order_id = $1';
      await pool.query(deleteOrderQuery, [order_id]);

      // Send success response
      res.status(200).json({ message: "Cart cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling cart:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  //buy router
  customer_router.post("/confirm_order", async (req, res) => {
    try {
      // Extract the user ID from the request body
      const { user_id } = req.body;
      // Update the delivery status to "seller unconfirmed" for the unconfirmed order associated with the user ID
      const updateDeliveryStatusQuery =
        'UPDATE "Order" SET isConfirm = true, delivery_status = $1 WHERE customer_id = $2 AND isConfirm = false RETURNING order_id';
      const { rows } = await pool.query(updateDeliveryStatusQuery, ['seller unconfirmed', user_id]);
      if (rows.length === 0) {
        // If no unconfirmed order is found, send an error response
        return res
          .status(400)
          .json({ error: "No unconfirmed order found for the user" });
      }
      // Send a success response with the order ID of the confirmed order
      res
        .status(200)
        .json({
          message: "Order confirmed successfully",
          order_id: rows[0].order_id,
        });
    } catch (error) {
      console.error("Error confirming order:", error);
      // Send an error response if an unexpected error occurs
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });  


module.exports = customer_router;
