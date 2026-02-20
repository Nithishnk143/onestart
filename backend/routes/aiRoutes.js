
const express = require("express");
const router = express.Router();
const axios = require("axios");

/* ===============================
   🧠 PSYCHOMETRIC SCORING
================================ */
const scoreMap = {
  "Strongly Agree": 4,
  "Agree": 3,
  "Neutral": 2,
  "Disagree": 1
};

function buildSummary(answers = []) {
  if (!answers.length) return "Low clarity and needs guidance";

  const scores = answers.map(a => scoreMap[a] || 2);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avg >= 3.5) return "High interest and strong confidence";
  if (avg >= 2.8) return "Moderate interest with good potential";
  return "Low clarity and needs guidance";
}

/* ===============================
   🎯 AI CAREER ROUTE (OLLAMA)
================================ */
router.post("/career", async (req, res) => {
  try {
    const { category, track, answers } = req.body;

    if (!category || !answers) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const summary = buildSummary(answers);

    let task = "";
    if (category === "10th") {
      task = "Suggest TOP 3 suitable DIPLOMA courses in India.";
    } else if (category === "12th") {
      task = "Suggest TOP 3 degree courses or career paths.";
    } else if (category === "UG" && track === "upskill") {
      task = "Suggest TOP 3 upskilling areas.";
    } else if (category === "UG" && track === "career") {
      task = "Suggest TOP 3 career paths.";
    } else if (category === "PG") {
      task = "Suggest TOP 3 specialized career paths.";
    } else if (category === "Working Professional") {
      task = "Suggest TOP 3 career growth paths.";
    } else {
      task = "Suggest TOP 3 suitable career recommendations.";
    }

    const prompt = `
You are a career guidance AI.

Psychometric Summary:
${summary}

TASK:
${task}

Return ONLY valid JSON in EXACT format:

{
  "recommendations": [
    { "title": "", "description": "" },
    { "title": "", "description": "" },
    { "title": "", "description": "" }
  ]
}

STRICT RULES:
- EXACTLY 3 recommendations
- ONLY JSON
- No markdown
- No explanation
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",   // ⭐ BEST MODEL
        prompt,
        stream: false
      },
      { timeout: 60000 }
    );

    const raw = response.data.response;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({
        error: "Ollama returned invalid JSON",
        raw
      });
    }

    if (
      !parsed.recommendations ||
      !Array.isArray(parsed.recommendations) ||
      parsed.recommendations.length !== 3
    ) {
      return res.status(500).json({
        error: "Invalid AI response structure",
        raw: parsed
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Ollama error:", err.message);
    res.status(500).json({ error: "Ollama AI failed" });
  }
});
router.post("/roadmap", async (req, res) => {
  try {
    const { career, skills, category } = req.body;

    if (!career) {
      return res.status(400).json({ error: "Career required" });
    }

    const prompt = `
You are a Career Roadmap Generator AI.

INPUT:
- Career: ${career}
- User Category: ${category}
- Skill Strengths: ${skills?.join(", ") || "General"}

TASK:
Generate a clear career roadmap in 3 phases.

OUTPUT RULES:
- Return ONLY valid JSON
- No extra text

FORMAT:
{
  "career": "${career}",
  "roadmap": {
    "shortTerm": [
      "Skill to learn",
      "Course suggestion",
      "Mini project idea"
    ],
    "midTerm": [
      "Advanced skill",
      "Certification",
      "Internship or experience"
    ],
    "longTerm": [
      "Specialization",
      "Job role / leadership",
      "Future growth goal"
    ]
  }
}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false
      }
    );

    const raw = response.data.response;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "Invalid roadmap JSON",
        raw
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
});

module.exports = router;
