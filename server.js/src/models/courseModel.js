const mongoose = require("mongoose");
const masterSchema = require("./mastermodel");

const courseSchema = new mongoose.Schema({
        ...masterSchema.obj,   //inherit all fields from masterSchema
        name: { type: String, required: true },
        description: { type: String },
        duration: { type: String },

})

module.exports = mongoose.model("Course", courseSchema);