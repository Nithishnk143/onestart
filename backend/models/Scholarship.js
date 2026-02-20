const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  name: String,
  eligibility: String,
  amount: String,
  deadline: Date,
  applyLink: String,

  eligibleDegrees: [String],   // ["10th","12th","UG","PG"]
  eligibleCastes: [String],    // ["SC","ST","OBC","BC","MBC","General"]
  eligibleGender: {
    type: String,
    enum: ["Male", "Female", "All"],
    default: "All"
  },

  sourceUrl: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },

  isPublished:{
    type: Boolean,
    default: false
  }
});



module.exports = mongoose.model("Scholarship", scholarshipSchema);
