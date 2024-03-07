const express = require("express");
const pool = require("../database/db");
const seller_router = express.Router();
// publicRouter.get("/all_products")
seller_router.get("/getSeller/:id", async (req, res) => {
  try {
    const { id } = req.params;
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

// Confirm pickup
seller_router.get("/sellerOrders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch orders with products for the seller
    const ordersQuery = `
  SELECT "Order".order_id AS orderId, 
         json_agg(
           json_build_object(
             'productId', Product.product_id,
             'productName', Product.product_name,
             'category', Product_category.category_name,
             'quantity', Contains.quantity
           )
         ) AS products
  FROM "Order"
  JOIN Contains ON "Order".order_id = Contains.order_id
  JOIN Product ON Contains.product_id = Product.product_id
  JOIN Product_category ON Product.Category_id = Product_category.Category_id
  WHERE "Order".isConfirm = TRUE 
  AND "Order".delivery_status = 'seller unconfirmed' 
  AND Product.seller_id = $1
  GROUP BY "Order".order_id;
`;

    const ordersResult = await pool.query(ordersQuery, [id]);
    const orders = ordersResult.rows;

    res.json(orders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

seller_router.post("/confirmOrder", async (req, res) => {
  try {
    const { orderid, pickupDate } = req.body;

    // Update product stock in the "Product" table
    const updateProductQuery = `
      UPDATE Product
      SET stock = stock - quantity
      FROM Contains
      WHERE Product.product_id = Contains.product_id
      AND Contains.order_id = $1
      RETURNING *, status;
    `;

    // Execute the update query
    const updatedProductsResult = await pool.query(updateProductQuery, [orderid]);
    const updatedProducts = updatedProductsResult.rows;

    // Call the PL/pgSQL function to update the order status
    const updateOrderStatusQuery = `
      SELECT update_order_status($1, $2);
    `;
    
    await pool.query(updateOrderStatusQuery, [orderid, pickupDate]);
    console.log("Updated products:", updatedProducts); 
    res.status(200).json({ message: "Order confirmed successfully", updatedProducts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = seller_router;
