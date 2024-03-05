const express = require("express");
const pool = require("../database/db");
const courier_router = express.Router();

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
    (SELECT delivery_pst_code FROM Courier_Service WHERE service_id = $1);

    `;

    const { rows } = await pool.query(ordersQuery, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = courier_router;
