const router = require("express").Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/locations", async (req, res) => {
  try {
    const locations = await pool.query("SELECT pst_code FROM Location");
    const pstCodes = locations.rows.map((location) => location.pst_code);
    res.json(pstCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/register", validInfo, async (req, res) => {
  try {
    // Destructure the req.body
    const {
      first_name,
      middle_name,
      last_name,
      user_name,
      user_password,
      contact_no,
      e_mail,
      location_pst_code,
      street, 
      area,
      town,
      user_type,
      TIN,
      Website,
      factory_address,
      office_address,
      salary,
      employee_type,
      delivery_pst_code, 
      vehicle_type,
      company_name
    } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE e_mail = $1", [
      e_mail,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).json({ error: "User Already Exists" });
    }

    // Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(user_password, salt);

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert location if provided
      if (street && area && town) {
        await client.query(
          "INSERT INTO Location_full (pst_code, street, area, town) VALUES ($1, $2, $3, $4)",
          [location_pst_code, street, area, town]
        );
      }

      // Insert user into Users table
      const newUser = await client.query(
        "INSERT INTO users (first_name, middle_name, last_name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id",
        [
          first_name,
          middle_name,
          last_name,
          user_name,
          bcryptPassword,
          contact_no,
          e_mail,
          location_pst_code,
          user_type,
        ]
      );

      // Get the newly inserted user_id
      const user_id = newUser.rows[0].user_id;

      // Insert additional info based on user_type
      if (user_type === "seller") {
        await client.query(
          "INSERT INTO seller (user_id, TIN, Website, factory_address, office_address,company_name) VALUES ($1, $2, $3, $4, $5, $6)",
          [user_id, TIN, Website, factory_address, office_address,company_name]
        );
      } else if (user_type === "customer") {
        await client.query("INSERT INTO customer (user_id) VALUES ($1)", [
          user_id,
        ]);
      } else if (user_type === "employee") {
        await client.query(
          "INSERT INTO employee (employee_id, salary, employee_type) VALUES ($1, $2, $3)",
          [user_id, salary, employee_type]
        );
      }

      // Insert additional info for courier service
      if (employee_type === "courier_service") {
        await client.query(
          "INSERT INTO Courier_Service (service_id, delivery_pst_code, vehicle_type) VALUES ($1, $2, $3)",
          [user_id, delivery_pst_code, vehicle_type] // Using provided delivery_pst_code
        );
      } else if (employee_type === "customer_care") {
        await client.query(
          "INSERT INTO Customer_Care (service_id) VALUES ($1)",
          [user_id]
        );
      }

      // Commit the transaction
      await client.query("COMMIT");

      // Send a success message back to the client
      return res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
      // Rollback the transaction in case of any error
      await client.query("ROLLBACK");
      console.error(err.message);
      return res.status(500).json({ error: "Server Error" });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    // Destructure the request body
    const { e_mail, user_password } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE e_mail = $1", [
      e_mail,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // Check if the password is valid
    const validPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // Get user type
    const userTypeQuery = await pool.query(
      "SELECT user_type FROM users WHERE e_mail = $1",
      [e_mail]
    );

    // Extract the user type from the query result
    const userType = userTypeQuery.rows[0].user_type;

    // If user is an employee, fetch additional details from the employee table
    if (userType === "employee") {
      // Query the employee table to get additional employee details
      const employeeDetailsQuery = await pool.query(
        "SELECT employee_type FROM employee WHERE employee_id = $1",
        [user.rows[0].user_id]
      );

      // Extract the employee type from the query result
      const employeeType = employeeDetailsQuery.rows[0].employee_type;

      // Generate JWT token
      const jwtToken = jwtGenerator(user.rows[0].user_id);

      // Return response with JWT token, user type, employee type, and user ID
      return res.json({
        jwtToken,
        userType,
        employeeType,
        userId: user.rows[0].user_id,
      });
    }

    // Generate JWT token for non-employee users
    const jwtToken = jwtGenerator(user.rows[0].user_id);

    // Return response with JWT token, user type, and user ID
    return res.json({ jwtToken, userType, userId: user.rows[0].user_id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" }); // Return JSON response with error message
  }
});

//is-verify route
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
