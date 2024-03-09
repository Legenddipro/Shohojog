//,,,,By Arian

const express = require("express");
const pool = require("../database/db");
const courier_router = express.Router();

//History router
// Route to get all history
courier_router.get("/courier-orders-history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query to fetch orders with status 'Courier confirmed' for the given courier ID
    const ordersQuery = `
    SELECT 
    "Order".order_id,
    "Order".order_date,
    "Order".isConfirm,
    "Order".isPaid,
    "Order".payment_date,
    "Order".delivery_time,
    "Order".customer_id,
    "Order".delivery_status,
    "Order".delivery_date,
    "Order".pickup_date,
    SUM(Contains.price) AS total_payment
  FROM 
    "Order"
  JOIN
    Contains ON "Order".order_id = Contains.order_id
  WHERE 
    "Order".delivery_status = 'Courier confirmed' AND 
    "Order".courier_employee_id = $1 AND
    "Order".isPaid = true
  GROUP BY
    "Order".order_id,
    "Order".order_date,
    "Order".isConfirm,
    "Order".isPaid,
    "Order".payment_date,
    "Order".delivery_time,
    "Order".customer_id,
    "Order".delivery_status,
    "Order".delivery_date,
    "Order".pickup_date
  ORDER BY
    "Order".payment_date DESC;
  
    `;

    const { rows } = await pool.query(ordersQuery, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
//PAY router
// Route to update order details when payment is received
courier_router.put("/on-payment-received/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Get the current timestamp for delivery_time
    const deliveryTime = new Date();

    // Update query to set isPaid to true, payment_date to current date, delivery_time to current time, and delivery_date to current date
    const updateOrderQuery = `
      UPDATE "Order"
      SET 
        isPaid = true,
        payment_date = CURRENT_DATE,
        delivery_time = $1,
        delivery_date = CURRENT_DATE
      WHERE 
        order_id = $2;
    `;

    await pool.query(updateOrderQuery, [deliveryTime, orderId]);

    res.status(200).json({ message: "Order details updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to get all orders with status 'Courier confirmed' for a specific courier
courier_router.get("/courier-orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query to fetch orders with status 'Courier confirmed' for the given courier ID
    const ordersQuery = `
      SELECT 
        order_id,
        order_date,
        isConfirm,
        isPaid,
        payment_date,
        delivery_time,
        customer_id,
        delivery_status,
        delivery_date,
        pickup_date
      FROM 
        "Order"
      WHERE 
        delivery_status = 'Courier confirmed' AND 
        courier_employee_id = $1 AND
        isPaid = false;
    `;

    const { rows } = await pool.query(ordersQuery, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get information about courier service
courier_router.get("/courier-info/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query to get courier information using the userId
    const courierInfoQuery = `
    SELECT 
    u.First_Name, 
    u.Last_Name, 
    u.e_mail,
    u.contact_no, 
    l.town, 
    cs.vehicle_type 
  FROM 
    Users u 
  INNER JOIN 
    Courier_Service cs ON u.user_id = cs.service_id 
  INNER JOIN 
    Location_full l ON cs.delivery_pst_code = l.pst_code 
  WHERE 
    u.user_id = $1;
    `;
    const { rows } = await pool.query(courierInfoQuery, [userId]);

    // If courier information is found, send it in the response
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
courier_router.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query to fetch orders
    const ordersQuery = `
    SELECT 
    order_id,
    order_date,
    isConfirm,
    isPaid,
    payment_date,
    delivery_time,
    customer_id,
    delivery_status,
    delivery_date,
    pickup_date
FROM 
    "Order"
WHERE 
    delivery_status = 'Seller confirms' AND 
    (SELECT location_pst_code FROM Users WHERE user_id = customer_id) = 
    (SELECT delivery_pst_code FROM Courier_Service WHERE service_id = $1)
    ORDER BY order_id ASC;
    `;

    const { rows } = await pool.query(ordersQuery, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
courier_router.put("/confirm-delivery/:orderId/:userId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.params.userId;

    // Update query to confirm delivery
    const confirmDeliveryQuery = `
      UPDATE "Order"
      SET courier_employee_id = $1,
          delivery_status = 'Courier confirmed'
      WHERE order_id = $2;
    `;

    await pool.query(confirmDeliveryQuery, [userId, orderId]);

    res.status(200).json({ message: "Delivery confirmed successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = courier_router;
