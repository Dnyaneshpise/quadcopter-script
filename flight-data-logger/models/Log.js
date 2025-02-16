const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: String, required: true },
  metadata: { type: Object },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);