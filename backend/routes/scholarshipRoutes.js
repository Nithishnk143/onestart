const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const Scholarship = require("../models/Scholarship");
const adminAuth = require("../middleware/adminAuth");

// OpenAI config

/* =====================================================
   🧠 ADMIN – EXTRACT SCHOLARSHIP FROM LINK (ADMIN ONLY)
===================================================== */
router.post("/extract", adminAuth, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Scholarship URL is required" });
  }

  try {
    /* ---------- 1️⃣ FETCH WEBPAGE ---------- */
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    /* ---------- 2️⃣ CLEAN HTML → TEXT ---------- */
    const $ = cheerio.load(response.data);

    // IMPORTANT: Buddy4Study-friendly extraction
    const pageText = $("body")
      .find("h1, h2, h3, p, li, span")
      .text()
      .replace(/\s+/g, " ")
      .slice(0, 8000);

    /* ---------- 3️⃣ AI EXTRACTION ---------- */
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
You are extracting scholarship details from an education website (Buddy4Study).

Extract ONLY scholarship-related information and return ONLY valid JSON.

Format:
{
  "name": "",
  "eligibility": "",
  "amount": "",
  "deadline": "YYYY-MM-DD or Ongoing",
  "applyLink": "",
  "eligibleDegrees": [],
  "eligibleCastes": []
}

Rules:
- Ignore ads, navigation, footer text
- eligibleDegrees must be from ["10th","12th","UG","PG"]
- eligibleCastes must be from ["SC","ST","OBC","BC","MBC","General"]
- If information not available, keep empty string or empty array
- Do NOT add explanations or markdown

Text:
${pageText}
          `
        }
      ]
    });

    /* ---------- 4️⃣ PARSE AI RESPONSE ---------- */
    const details = JSON.parse(
      aiResponse.choices[0].message.content
    );

    /* ---------- 5️⃣ SAVE TO DATABASE ---------- */
    const savedScholarship = await Scholarship.create({
      ...details,
      sourceUrl: url,
      createdBy: "admin"
    });

    res.json({
      message: "Scholarship extracted and saved successfully",
      scholarship: savedScholarship
    });

  } catch (err) {
    console.error("Scholarship extraction error:", err);
    res.status(500).json({
      error: "Scholarship extraction failed"
    });
  }
});

/* =====================================================
   👨‍🎓 USER – GET ALL ACTIVE SCHOLARSHIPS
===================================================== */
router.get("/", async (req, res) => {
  try {
    const today = new Date();

    const scholarships = await Scholarship.find({
      deadline: { $gte: today },
      isPublished: true
    }).sort({ deadline: 1 });

    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});

/* =====================================================
   🎯 USER – FILTER BY DEGREE + CASTE
===================================================== */
router.post("/filter", async (req, res) => {
  const { degree } = req.body;

  if (!degree) {
    return res.status(400).json({
      error: "Degree is required"
    });
  }

  try {
    const today = new Date();

    const scholarships = await Scholarship.find({
      isPublished: true,
      deadline: { $gte: today },

      $or: [
        { eligibleDegrees: { $size: 0 } }, // applicable for all
        { eligibleDegrees: degree }         // exact degree match
      ]
    }).sort({ deadline: 1 });

    res.json(scholarships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Filtering failed" });
  }
});


// 👨‍💼 ADMIN – GET ALL SCHOLARSHIPS
router.get("/admin/all", adminAuth, async (req, res) => {
  const scholarships = await Scholarship.find().sort({ createdAt: -1 });
  res.json(scholarships);
});

/* =========================
   👨‍💼 ADMIN – UPDATE SCHOLARSHIP  ✅ ADD HERE
========================= */
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

/* =========================
   USER – FILTER
========================= */
router.post("/filter", async (req, res) => {
  const { degree, caste } = req.body;

  if (!degree || !caste) {
    return res.status(400).json({
      error: "Degree and caste are required"
    });
  }

  try {
    const today = new Date();

    const scholarships = await Scholarship.find({
      deadline: { $gte: today },
      $and: [
        {
          $or: [
            { eligibleDegrees: { $size: 0 } },
            { eligibleDegrees: degree }
          ]
        },
        {
          $or: [
            { eligibleCastes: { $size: 0 } },
            { eligibleCastes: caste }
          ]
        }
      ]
    });

    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: "Scholarship filtering failed" });
  }
});

/* =====================================================
   🧑‍💼 ADMIN – DELETE SCHOLARSHIP (ADMIN ONLY)
===================================================== */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
