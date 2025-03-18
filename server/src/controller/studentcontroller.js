require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Feedback = require("../models/feedbackModel");
const Batch = require("../models/batchModel");
const Course = require("../models/courseModel");
const Trainer = require("../models/trainerModel");
const multer = require("multer");
const path = require("path");
const { cloudinary } = require("../config/cloudinaryconfig");

exports.registerStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const defaultPassword = "student";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const student = User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      createdBy: req.user.id,
      isFirstLogin: true,
    });

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        defaultPassword,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.loginStudent = async (req, res) => {
    try {
      const { email, password } = req.body;
      const student = await User.findOne({ email, role: "student" });
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: student._id, role: student.role, email: student.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({ 
        message: "Login successful", 
        token, 
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          isFirstLogin: student.isFirstLogin
        }
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  