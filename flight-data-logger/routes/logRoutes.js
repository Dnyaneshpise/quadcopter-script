const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const auth = require("../middleware/auth");

// Specific routes first
router.get("/date/:date", auth, logController.getLogsByDate); // Date-specific route

// General routes later
router.post("/upload", auth, logController.uploadLog);
router.get("/", auth, logController.getLogs);
router.get("/:id", auth, logController.getLogById);
router.get("/:id/export", auth, logController.exportLog);

module.exports = router;