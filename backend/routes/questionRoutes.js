const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

router.post("/", async (req, res) => {
  const { category, track } = req.body;

  let query = { category };

  // 🔥 IMPORTANT FIX FOR UG
  if (category === "UG") {
    query.track = track; // "upskill" OR "career"
  }

  try {
    const questions = await Question.find(query).limit(20);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});


module.exports = router;
