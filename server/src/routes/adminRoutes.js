const express = require("express");
const router = express.Router();
const adminController = require("../controller/admincontroller");
const authMiddleware = require("../middleware/auth");
    
//users endpoint
router.post("/add-user" ,authMiddleware,adminController.addUser);
router.get("/view-user/:id",authMiddleware, adminController.viewUser);
router.get("/list-users",authMiddleware, adminController.listUsers);
router.put("/update-user/:id",authMiddleware, adminController.updateUser);
router.delete("/delete-user/:id", authMiddleware,adminController.deleteUser);


//trainer endpoint
router.post("/add-trainer", authMiddleware, adminController.addTrainer);
router.get("/view-trainer/:id",authMiddleware, adminController.viewTrainer);
router.get("/list-trainers", authMiddleware,adminController.listTrainers);
router.put("/update-trainer/:id",authMiddleware, adminController.updateTrainer);
router.delete("/delete-trainer/:id", authMiddleware,adminController.deleteTrainer);


// courses  endpoints
router.post("/add-course",authMiddleware,adminController.addCourse);
router.get("/view-course/:id",authMiddleware,adminController.viewCourse);
router.put("/update-course/:id",authMiddleware,adminController.updateCourse);
router.delete("/delete-course/:id",authMiddleware,adminController.deleteCourse);
router.get("/list-courses",authMiddleware,adminController.listCourses);


// batch enpoints
router.post("/add-batch",authMiddleware,adminController.addBatch);
router.get("/view-batch/:id",authMiddleware,adminController.viewBatch);
router.put("/update-batch/:id",authMiddleware,adminController.updateBatch);
router.delete("/delete-batch/:id",authMiddleware,adminController.deleteBatch);
router.get("/list-batches",authMiddleware,adminController.listBatches);







router.get("/get-available-options",authMiddleware,adminController.getAvailableOptions);
router.get("/get-students",authMiddleware, adminController.getStudents);
router.get("/get-courses", authMiddleware,adminController.getCourses);  
router.get("/get-trainers", authMiddleware,adminController.getTrainers);



module.exports = router
