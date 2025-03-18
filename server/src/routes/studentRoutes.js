const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentcontroller");
const authMiddleware = require("../middleware/auth");
const {uploadMiddleware} = require("../config/cloudinaryconfig");


router.post("/register", authMiddleware, studentController.registerStudent);
router.post("/login", studentController.loginStudent);


router.put("/change-password", authMiddleware, studentController.changePassword);
router.put("/update-profile", authMiddleware, studentController.updateProfile);
router.get("/profile", authMiddleware, studentController.viewProfile);
router.post("/upload-profile",authMiddleware, uploadMiddleware.single("profileImage"), studentController.uploadProfileImage);

router.post("/submit-feedback", authMiddleware, studentController.submitFeedback);
router.get("/batch-details", authMiddleware, studentController.viewBatchDetails);
router.get("/feedback", authMiddleware, studentController.viewMyFeedbacks);



module.exports = router;
