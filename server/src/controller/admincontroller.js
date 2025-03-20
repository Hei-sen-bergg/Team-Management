const User = require("../models/userModel");
// const Trainer = require("../models/trainermodel");
const bcrypt = require("bcryptjs");
const Course = require("../models/courseModel");
const Batch = require("../models/batchModel");

// <------------------Student-------------------->

exports.addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body

    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const { name, email, password, role } = req.body;
    console.log("Extracted role:", role); // Log extracted role
    if (!["student", "trainer"].includes(role))
      return res.status(400).json({ msg: "Invalid role" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      createdBy: req.user._id,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// exports.addTrainer = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const trainer = new User({
//       name,
//       subject,
//       email,
//       role: "trainer",
//       createdBy: req.user._id,
//     });
//     await trainer.save();
//     res.status(201).json({ msg: "Trainer created successfully", trainer });
//   } catch (error) {

//     res
//       .status(500)
//       .json({ msg: "Internal server error", error: error.message });
//   }
// };

exports.viewUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// <------------------Trainer-------------------->

exports.addTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { name, subject, email, password } = req.body;
    // const image = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const trainer = new User({
      name,
      subject,
      email,
      password: hashedPassword,
      role: "trainer",
      createdBy: req.user.id,
    });
    await trainer.save();
    res.status(201).json({ message: "Trainer added successfully", trainer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.viewTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const trainer = await User.findOne({ _id: req.params.id, role: "trainer" });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.json({ trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const trainer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "trainer" },
      req.body,
      { new: true }
    );

    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.json({ message: "Trainer updated successfully", trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const trainer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listTrainers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const trainers = await User.find({ role: "trainer" });
    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// <------------------Courses-------------------->

exports.addCourse = async (req, res) => {
  try {addCourse
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const { name, description, duration } = req.body;
    const course = new Course({
      name,
      description,
      duration,
      createdBy: req.user.id,
    });
    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.viewCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listCourses = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// <------------------Batch-------------------->

exports.addBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const { courseId, batchName, startDate, trainerId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const trainer = await User.findOne({ _id: trainerId, role: "trainer" });
    if (!trainer) {
      return res
        .status(400)
        .json({ message: "Invalid Trainer ID or Trainer does not exist" });
    }
    // const batch = new Batch({
    //   courseId,
    //   batchName,
    //   startDate,
    //   trainerId,
    //   createdBy: req.user.id,
    // });

    // await batch.save();

    const batch = await Batch.create({
      courseId,
      batchName,
      startDate,
      trainerId,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Batch added successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const batch = await Batch.findById(req.params.id)
      .populate("trainerId", "name")
      .populate("courseId", "name");

    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch updated successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.deleteBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listBatches = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const batches = await Batch.find()
      .populate("trainerId", "name")
      .populate("courseId", "name")
      .lean();
    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// <---------------get available options------------------

exports.getAvailableOptions = async (req, res) => {
  try {
    const trainers = await User.findOne({ role: "trainer" });
    const courses = await Course.find(); // Get all courses

    return res.status(200).json({ trainers, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTrainers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const trainers = await User.find({ role: "trainer" });
    res.json(trainers);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getStudents = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCourses = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// <------------------ batch allocations------------------->

exports.allocateStudentToBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { studentId, batchId, courseId, trainerId } = req.body;

    if (!studentId || !batchId || !courseId || !trainerId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const trainer = await User.find({ role: "trainer", _id: trainerId });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const existingAllocation = await StudentCourseBatch.findOne({
      studentId,
      courseId,
      batchId,
      trainerId,
      isActive: true,
    });

    if (existingAllocation) {
      return res
        .status(400)
        .json({ message: "Student is already allocated to this batch" });
    }

    const allocation = new StudentCourseBatch({
      studentId,
      courseId,
      batchId,
      trainerId,
      createdBy: req.user.id,
    });

    await allocation.save();
    const completeAllocation = await StudentCourseBatch.findById(allocation._id)
      .populate("studentId", "name email")
      .populate("courseId", "name description")
      .populate("batchId", "batchName startDate")
      .populate("trainerId", "trainerName")
      .lean();

    res.status(201).json({
      message: "Student allocated to batch successfully",
      data: completeAllocation,
    });
  } catch (error) {
    console.error("Error allocating student to batch:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeBatchAllocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can remove allocations.",
      });
    }
    const { id } = req.params;
    const allocation = await StudentCourseBatch.findById(id);
    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found.",
      });
    }

    await StudentCourseBatch.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Allocation removed successfully.",
    });
  } catch (error) {
    console.error("Error removing allocation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.listBatchAllocatons = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view all allocations.",
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const allocations = await StudentCourseBatch.find({ isActive: true })
      .populate("studentId", "name email")
      .populate("courseId", "name description")
      .populate("batchId", "batchName startDate")
      .populate("trainerId", "trainerName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await StudentCourseBatch.countDocuments({ isActive: true });
    return res.status(200).json({
      success: true,
      data: allocations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error listing allocations:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAvailableOptions = async (req, res) => {
  try {
    const trainers = await User.findOne({ role: "trainer" });
    const courses = await Course.find();

    return res.status(200).json({
      trainers,
      courses,
    });
  } catch (error) {
    console.error("Error getting available options:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
