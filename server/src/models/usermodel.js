const mongoose = require("mongoose");
const masterSchema = require("./mastermodel");

const userSchema = new mongoose.Schema({
    ...masterSchema.obj,   //inherit all fields from masterSchema
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum:["student","trainer","admin"], required: true},
    profileImage:String,
    profileImageUrl: String

})

    userSchema.pre("save", function (next) {
        if(this.role === "admin"){
            this.createdBy = undefined
        }
        next()
    })




module.exports = mongoose.model("User", userSchema);