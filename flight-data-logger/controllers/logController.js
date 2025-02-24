const Log = require("../models/Log");
const cloudinary = require("../config/cloudinary");
const { Parser } = require("json2csv");
const multer = require("multer");
const moment = require("moment"); 

const upload = multer({ dest: "uploads/" }).single("file");

// Upload log file
exports.uploadLog = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let result;
try {
  result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    folder: "flight-logs",
  });
} catch (uploadError) {
  console.error("Cloudinary upload error:", uploadError); // Logs error for debugging
  return res.status(500).json({ message: "Cloud upload failed" });
}


    const newLog = new Log({
      user: req.user.id,
      file: result.secure_url,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
    });

    await newLog.save();
    res.status(201).json({ message: "Log uploaded successfully", log: newLog });
  } catch (error) {
    console.error("Error in uploadLog:", error); // Debugging
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
    const log = await Log.findById(req.params.id).populate("user", "name email");

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

// Get logs by date with pagination
exports.getLogsByDate = async (req, res) => {
  try {
    const dateParam = req.params.date;
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 logs per page

    // Validate date format using moment.js
    const date = moment(dateParam, "YYYY-MM-DD", true);
    if (!date.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const query = {
      user: req.user.id,
      date: {
        $gte: date.startOf("day").toDate(), // Start of the day (00:00:00)
        $lt: date.endOf("day").toDate(), // End of the day (23:59:59)
      },
    };

    const logs = await Log.find(query)
      .populate("user", "name email")
      .skip((page - 1) * limit) // Skip logs for previous pages
      .limit(parseInt(limit)); // Limit the number of logs per page

    const totalLogs = await Log.countDocuments(query); // Get total logs for pagination

    res.status(200).json({
      logs,
      totalPages: Math.ceil(totalLogs / limit), // Total pages
      currentPage: parseInt(page), // Current page
      totalLogs, // Total logs matching the query
    });
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

// controllers/logController.js
exports.analyzeLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id).populate("user", "name email");

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // Authorization: Only log owner or admin can analyze logs
    if (log.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Example analysis (replace with actual logic)
    const analysis = {
      duration: "2 hours",
      maxAltitude: "1500 meters",
      flightPath: "GPS coordinates here",
      anomalies: "No anomalies detected",
    };

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};