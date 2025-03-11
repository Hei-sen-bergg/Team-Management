const express = require("express");
const router = express.Router();
const adminController = require("../controller/admincontroller");
const authMiddleware = require("../middleware/auth");
    
//users endpoint
router.post("/add-user" ,adminController.addUser);
router.get("/view-user:id", adminController.viewUser);
router.get("/list-users", adminController.listUsers);
router.put("/update-user/:id", adminController.updateUser);
router.delete("/delete-user/:id", adminController.deleteUser);


//trainer endpoint
router.post("/add-trainer", adminController.addTrainer);
router.get("/view-trainer/:id", adminController.viewTrainer);
router.get("/list-trainers", adminController.listTrainers);
router.put("/update-trainer/:id", adminController.updateTrainer);
router.delete("/delete-trainer/:id", adminController.deleteTrainer);


// courses  endpoints
router.post("/add-course",adminController.addCourse);
router.get("/view-course/:id",adminController.viewCourse);
router.put("/update-course/:id",adminController.updateCourse);
router.delete("/delete-course/:id",adminController.deleteCourse);
router.get("/list-courses",adminController.listCourses);


// batch enpoints
router.post("/add-batch",adminController.addBatch);
router.get("/view-batch/:id",adminController.viewBatch);
router.put("/update-batch/:id",adminController.updateBatch);
router.delete("/delete-batch/:id",adminController.deleteBatch);
router.get("/list-batches",adminController.listBatches);







router.get("/get-available-options",adminController.getAvailableOptions);
router.get("/get-students", adminController.getStudents);
router.get("/get-courses", adminController.getCourses);  
router.get("/get-trainers", adminController.getTrainers);



module.exports = router
