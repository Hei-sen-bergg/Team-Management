const mongoose = require("mongoose");
const masterSchema = require("./mastermodel");


const feedbackSchema = new mongoose.Schema({

    ...masterSchema.obj,   //inherit all fields from masterSchema
    studentId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId:{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    batchId:{ type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    trainerId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:{ 
        knowledge: { type: Number, min: 1, max: 5, required: true },
        communication: { type: Number, min: 1, max: 5, required: true },
        punctuality: { type: Number, min: 1, max: 5, required: true },
    },
    comment:{ type: String },
    week:{ type: String , required: true },
})


module.exports = mongoose.model("Feedback", feedbackSchema);