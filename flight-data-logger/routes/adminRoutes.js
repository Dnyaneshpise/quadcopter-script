const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", auth, roleMiddleware(["admin"]), adminController.getAdminDashboard);

module.exports = router;