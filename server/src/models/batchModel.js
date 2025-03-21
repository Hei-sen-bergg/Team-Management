const mongoose = require("mongoose");
const masterSchema = require("./mastermodel");

const batchSchema = new mongoose.Schema({

    ...masterSchema.obj,   //inherit all fields from masterSchema
     courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
     batchName:{ type: String, required: true },
     startDate:{ type: Date, required: true },
    //  endDate:{ type: Date },
     trainerId:{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
})

module.exports = mongoose.model("Batch", batchSchema);  