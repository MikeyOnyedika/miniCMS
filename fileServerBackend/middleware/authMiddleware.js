const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const mongoose = require("mongoose");

// same protect middleware from the main backend
async function protect(req, res, next) {
  // check for the token in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(
        new mongoose.Types.ObjectId(decoded.id)
      );
      req.admin = { email: admin.email };
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token or Token expired" });
  }
}

module.exports = { protect };
