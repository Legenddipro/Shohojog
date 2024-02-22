const pool = require("../database/db");
module.exports = async (req, res, next) => {
  const {
    first_name,
    last_name,
    user_name,
    user_password,
    contact_no,
    e_mail,
    location_pst_code,
    user_type,
  } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    console.log(!e_mail.length);
    if (
      ![
        first_name,
        last_name,
        user_name,
        user_password,
        contact_no,
        e_mail,
        location_pst_code,
        user_type,
      ].every(Boolean)
    ) {
      return res.status(401).json("Missing Credentials");
    }

    if (
      user_type !== "seller" &&
      user_type !== "customer" &&
      user_type !== "employee"
    ) {
      return res.status(401).json("Invalid User Type");
    }
    if (user_password.length < 8) {
      return res
        .status(401)
        .json("Password should be at least 8 characters long");
    } 
    if (!validEmail(e_mail)) {
      return res.status(401).json("Invalid Email");
    }
    const existingUser = await pool.query('SELECT * FROM users WHERE user_name = $1', [user_name]);
    if (existingUser.rows.length > 0) {
        return res.status(401).json("User Name is already taken");
    }
  } else if (req.path === "/login") {
    if (![e_mail, user_password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(e_mail)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};
