require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");


connectDB();

const app = express();

app.use(express.json());
app.use(cors());


//routes to be defined below later
app.use("/api/auth", require("./src/routes/authRoutes"));
// app.use("/api/admin")
// app.use("/api/student")
// app.use("/api/trainer")


app.get("/", (req, res) => {
    res.send("The api is working fine");
})





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




