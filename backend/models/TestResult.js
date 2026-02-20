const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  category: String,
  answers: [String],
  aiResult: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestResult", testResultSchema);
