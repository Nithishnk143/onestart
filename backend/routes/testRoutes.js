const express = require("express");
const router = express.Router();
const TestResult = require("../models/TestResult");

// SAVE RESULT
router.post("/save", async (req, res) => {
  try {
    const { userId, category, track, answers, aiResult } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    // delete old test (retake)
    await TestResult.deleteMany({ userId, category, track });

    const saved = await TestResult.create({
      userId,
      category,
      track,
      answers,
      aiResult
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
