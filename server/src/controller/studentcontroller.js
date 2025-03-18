require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Feedback = require("../models/feedbackModel");
// const Batch = require("../models/batchModel");
// const Course = require("../models/courseModel");
// const Trainer = require("../models/trainerModel");
const StudentCourseBatch = require("../models/studentCourseModel");
// const multer = require("multer");
// const path = require("path");
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
        isFirstLogin: student.isFirstLogin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password entered is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    student.isFirstLogin = false;

    await student.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      student.email = email;
    }

    if (name) {
      student.name = name;
    }

    await student.save();
    res.json({
      message: "Profile updated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    const student = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "createdBy",
        select: "name email",
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const profileData = {
      ...student.toObject(),
      profileImageUrl: student.profileImageUrl || null,
    };
    res.status(200).json({ profileData });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only students can upload images" });
    }
    if (student.profileImageUrl) {
      const publicId = student.profileImageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`student-profiles/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    student.profileImageUrl = req.file.path;
    await student.save();
    res.json({
      message: "Profile image uploaded successfully",
      profileImageUrl: student.profileImageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { trainerId, courseId, batchId, ratings, comments, week } = req.body;
    const enrollment = await StudentCourseBatch.findOne({
      studentId: req.user.id,
      courseId,
      batchId,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Enrollment not found" });
    }

    const existingFeedback = await Feedback.findOne({
      studentId: req.user.id,
      trainerId,
      courseId,
      batchId,
      week,
    });

    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "Feedback already submitted for this week" });
    }

    const ratingFields = ["knowledge", "communication", "punctuality"];
    for (const field of ratingFields) {
      if (!ratings[field] || ratings[field] < 1 || ratings[field] > 5) {
        return res.status(400).json({
          message: `Invalid rating for ${field}. Must be between 1 and 5`,
        });
      }
    }

    const feedback = new Feedback({
      studentId: req.user.id,
      trainerId,
      courseId,
      batchId,
      week,
      ratings,
      comments,
      createdBy: req.user.id,
    });

    await feedback.save();
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewBatchDetails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ message: "Access denied, authentication required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { studentId: req.user.id, isActive: true };

    const studentCourses = await StudentCourseBatch.find(query)
      .populate({
        path: "batchId",
        select: "batchName startDate status",
        match: { status: { $ne: "deleted" } },
      })
      .populate({
        path: "courseId",
        select: "name description duration price",
        match: { isActive: true },
      })
      .populate({
        path: "trainerId",
        select: "name",
        match: { isActive: true },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const filteredCourses = studentCourses.filter(
      (course) => course.batchId && course.courseId && course.trainerId
    );

    if (!filteredCourses) {
      return res
        .status(404)
        .json({ success: false, message: "No active batch enrollments found" });
    }

    const totalCount = await StudentCourseBatch.countDocuments(query);

    res.status(200).json({
      success: true,
      data: filteredCourses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (error) {

    console.error("Error fetching batch details:", error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching batch details" });
  }
}


exports.viewMyFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ 
      studentId: req.user.id,
      isActive: true 
    })
    .populate('trainerId', 'name email subject')
    .populate('courseId', 'name description')
    .populate('batchId', 'batchName startDate')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Feedback.countDocuments({ 
      studentId: req.user.id,
      isActive: true 
    });

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("View Feedbacks Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};




























