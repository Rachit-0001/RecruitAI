const ai = require("../config/gemini");
const AiLogModel = require("../models/aiLogModel");
const asyncHandler = require("../utils/asyncHandler");

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ================= Resume Summary =================

const resumeSummary = asyncHandler(async (req, res) => {
  const { resumeText, candidateId } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      success: false,
      message: "resumeText is required",
    });
  }

  const prompt = `
You are an AI recruitment assistant.

Write a concise professional summary (3-4 sentences) of the following resume.

Resume:
${resumeText}
`;

  const result = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const summary = result.text.trim();

  await AiLogModel.create({
    candidate_id: candidateId || null,
    summary,
    match_score: null,
  });

  res.json({
    success: true,
    data: {
      summary,
    },
  });
});

// ================= Job Match =================

const jobMatch = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription, candidateId } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      success: false,
      message: "resumeText and jobDescription are required",
    });
  }

  const prompt = `
Compare this resume against the given job description.

Return ONLY valid JSON.

{
  "matchPercentage": 90,
  "matchingSkills": [],
  "missingSkills": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const result = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const raw = result.text;

  const parsed = extractJson(raw);

  if (!parsed) {
    return res.status(500).json({
      success: false,
      message: "AI returned invalid JSON",
    });
  }

  await AiLogModel.create({
    candidate_id: candidateId || null,
    summary: null,
    match_score: parsed.matchPercentage || null,
  });

  res.json({
    success: true,
    data: parsed,
  });
});

// ================= Interview Questions =================

const interviewQuestions = asyncHandler(async (req, res) => {
  const { jobRole } = req.body;

  if (!jobRole) {
    return res.status(400).json({
      success: false,
      message: "jobRole is required",
    });
  }

  const prompt = `
Generate exactly 10 technical interview questions for the role "${jobRole}".

Return ONLY valid JSON.

{
  "questions": [
    "Question 1",
    "Question 2"
  ]
}
`;

  const result = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const raw = result.text;

  const parsed = extractJson(raw);

  if (!parsed) {
    return res.status(500).json({
      success: false,
      message: "AI returned invalid JSON",
    });
  }

  res.json({
    success: true,
    data: parsed,
  });
});

module.exports = {
  resumeSummary,
  jobMatch,
  interviewQuestions,
};