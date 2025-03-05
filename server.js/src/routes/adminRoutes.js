const express = require("express");
const router = express.Router();
const adminController = require("../controller/admincontroller");
const authMiddleware = require("../middleware/auth");


router.post("/add-user", authMiddleware ,adminController.addUser);
router.post("/add-trainer", adminController.addTrainer);


module.exports = router
