const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller");


//connect with controller later
router.post("/register", authController.registerAdmin);
router.post("/login", authController.login);

module.exports = router