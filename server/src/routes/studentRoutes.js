const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentcontroller");
const authMiddleware = require("../middleware/auth");
const {uploadMiddleware} = require("../config/cloudinaryconfig");


router.post("/register", authMiddleware, studentController.registerStudent);
router.post("/login", studentController.loginStudent);
