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
const { marked } = require("marked");

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
    const htmlContent = marked(data);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
          }
        </style>
      </head>
      <body>
        <article class="markdown-body">
          ${htmlContent}
        </article>
      </body>
      </html>
    `);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
