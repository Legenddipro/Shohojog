const pool = require('../database/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('jwtToken');
    
    // Check if token exists
    if (!token) {
      return res.status(403).json('Not Authorized');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const userId = decoded.user;

    // Query the database to get user details
    const userQuery = await pool.query(
      'SELECT user_type FROM Users WHERE user_id = $1',
      [userId]
    );
    const userType = userQuery.rows[0].user_type;

    // Determine the user type and set the corresponding value
    let userTypeValue;
    switch (userType) {
      case 'seller':
        userTypeValue = 1;//seller
        break;
      case 'customer':
        userTypeValue = 2;//customer
        break;
      case 'employee':
        userTypeValue = 3;//employee
        break;
      default:
        userTypeValue = -1; // Unknown user type
    }

    // Attach the userTypeValue to the request object for further processing
    req.userType = userTypeValue;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json('Token is not valid');
  }
};
