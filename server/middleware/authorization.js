const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  //verify token
  try {
    //get token from header
    const token = req.header("jwtToken");
    //check if not token
    if (!token) {
      return res.status(403).json("Not Authorized");
    }
    const payLoad = jwt.verify(token, process.env.jwtSecret);
    req.user = payLoad.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json("Token is not valid");
  }
};
