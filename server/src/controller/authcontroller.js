const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if admin exists
    let admin = await User.findOne({ email });
    if (admin) {
      return res.status(404).json({ msg: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdBy: null,
    });

    await admin.save();
    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ msg: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};
