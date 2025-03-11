const mongoose = require("mongoose");
const masterSchema = require("./mastermodel");

const studentCourseBatchSchema = new mongoose.Schema({

    ...masterSchema.obj,   //inherit all fields from masterSchema
    studentId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId:{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    batchId:{ type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    trainerId:{ type: mongoose.Schema.Types.ObjectId, ref: "User"} 
})


module.exports = mongoose.model("StudentCourseBatch", studentCourseBatchSchema);