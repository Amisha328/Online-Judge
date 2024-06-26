const User = require('../models/User');
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Token verification failed" });
    } else {
      const user = await User.findById(data.id);
      if (user.email === process.env.ADMIN_EMAIL) {
        next();
      } else {
        return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
      }
    }
  });
};
        