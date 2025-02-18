// routes/logRoutes.js
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

// Specific routes first
router.get("/date/:date", auth, logController.getLogsByDate);

// General routes later
router.post("/upload", auth, logController.uploadLog);
router.get("/", auth, logController.getLogs);
router.get("/:id", auth, logController.getLogById);
router.get("/:id/export", auth, logController.exportLog);

// Add the analyze log endpoint
router.get("/:id/analyze", auth, roleMiddleware(["admin"]), logController.analyzeLog);

module.exports = router;