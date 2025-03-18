const express = require("express");
const router = express.Router();
const trainerController = require("../controller/trainercontroller");

const authMiddleware = require("../middleware/auth");




router.get('/students', authMiddleware, trainerController.viewTrainerStudents); 
router.get('/feedbacks', authMiddleware, trainerController.viewTrainerFeedbacks);


module.exports = router;