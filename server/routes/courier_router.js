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
    Location l ON cs.delivery_pst_code = l.pst_code 
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

module.exports = courier_router;

