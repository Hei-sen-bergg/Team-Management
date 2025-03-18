const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("authorization")?.split(" ")[1];

    if (!token)
      return res.status(401).json({ msg: "Access Denied ! No token Provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    console.log(req.user);
    
    if (!req.user)
      return res.status(401).json({ msg: "Unauthorised, User not found" });

    next();
  } catch (error) {
    console.error("Authorisation Error", error);
    res.status(500).json({ msg: "Invalid or expired token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  next();
};
