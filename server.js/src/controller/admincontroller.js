const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");

// exports.addUser = async (req, res) => {
//   try {

//     console.log("Request Body:", req.body); // Log the incoming request body

//     if (req.user.role !== "admin")
//       return res.status(403).json({ msg: "Access denied" });

//     const { name, email, password, role } = req.body;
//     console.log("Extracted role:", role); // Log extracted role
//     if (!["student", "trainer"].includes(role))
//       return res.status(400).json({ msg: "Invalid role" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       createdBy: req.user._id,
//     });
//     console.log(newUser);
//     await newUser.save();
//     res.status(201).json({ msg: "User created successfully", user: newUser });
//   } catch (error) {

//     res.status(500).json({ msg: "Internal server error", error: error.message });

//   }
// };


exports.addUser = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Log the request body
      console.log("Request User:", req.user); // Log req.user
  
      // Explicitly check if role exists in req.body
      if (!req.body.role) {
        return res.status(400).json({ msg: "Role is missing" });
      }
      
      const { name, email, password, role } = req.body;
      console.log("Extracted Role:", role); // Log the extracted role
      
      if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied" });
      }
  
      if (!["student", "trainer"].includes(role)) {
        return res.status(400).json({ msg: "Invalid role" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        createdBy: req.user._id,
      });
  
      await newUser.save();
      res.status(201).json({ msg: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  };
  


exports.addTrainer = async (req, res) => {

try {
    const { name, email, password} = req.body;

    const trainer = new User({
        name, subject, email, role: "trainer", createdBy: req.user._id
    })
    await trainer.save()
    res.status(201).json({ msg: "Trainer created successfully", trainer })
} catch (error) {
    
    
}

}
