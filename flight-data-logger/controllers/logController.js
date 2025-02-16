const Log = require("../models/Log");
const cloudinary = require("../config/cloudinary");
const { Parser } = require("json2csv");
const multer = require("multer");

const moment = require("moment");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }).single("file");

// Upload log file
exports.uploadLog = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "flight-logs",
      });

      const newLog = new Log({
        user: req.user.id,
        file: result.secure_url,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
      });

      await newLog.save();
      res
        .status(201)
        .json({ message: "Log uploaded successfully", log: newLog });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id });
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get log by ID
exports.getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    if (log.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logs by date
// controllers/logController.js

exports.getLogsByDate = async (req, res) => {
  try {
    const dateParam = req.params.date;

    // Validate date format using moment.js
    if (!moment(dateParam, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const date = new Date(dateParam);
    const logs = await Log.find({
      user: req.user.id,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    }).populate("user", "name email");

    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Export log
exports.exportLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    if (log.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const format = req.query.format || "csv";

    switch (format.toLowerCase()) {
      case "csv":
        const fields = ["_id", "user", "file", "date", "metadata.flightNumber"];
        const parser = new Parser({ fields });
        const csv = parser.parse(log.toJSON());

        res.header("Content-Type", "text/csv");
        res.attachment(`flight-log-${log._id}.csv`);
        return res.send(csv);

      case "json":
        res.header("Content-Type", "application/json");
        res.attachment(`flight-log-${log._id}.json`);
        return res.send(log);

      default:
        return res.status(400).json({ message: "Unsupported format" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
