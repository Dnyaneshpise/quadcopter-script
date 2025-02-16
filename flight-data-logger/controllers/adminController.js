const User = require("../models/User");
const Log = require("../models/Log");

// Get admin dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const stats = {
      totalUsers: await User.countDocuments(),
      totalLogs: await Log.countDocuments(),
      recentLogs: await Log.find().sort({ date: -1 }).limit(5),
    };

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};