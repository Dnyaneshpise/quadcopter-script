const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);

// Home route
app.get("/api", (req, res) => {
  res.redirect("/api/docs");
});

// API Documentation route
app.get("/api/docs", (req, res) => {
  const filePath = path.join(__dirname, "..", "README.md");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading documentation file.");
    }
    res.send(data);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
