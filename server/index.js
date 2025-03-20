require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    methods: ["*"],
    
  })
);

app.use("/uploads", express.static("uploads"));


//routes to be defined below later
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/trainer", require("./src/routes/trainerRoutes"));
app.use("/api/student", require("./src/routes/studentRoute"));  
app.use("/api/admin", require("./src/routes/batchallocationroutes"));


app.get("/", (req, res) => {
  res.send("The api is working fine");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
