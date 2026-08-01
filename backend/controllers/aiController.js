const { getModel } = require("../config/gemini");
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

// POST /api/ai/resume-summary
const resumeSummary = asyncHandler(async (req, res) => {
  const { resumeText, candidateId } = req.body;
  if (!resumeText) {
    return res.status(400).json({ success: false, message: "resumeText is required" });
  }

  const model = getModel();
  const prompt = `You are a recruitment assistant. Write a concise, professional 3-4 sentence
summary of this candidate's resume, highlighting key skills, experience level, and strengths.
Return plain text only, no markdown.

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text().trim();

  await AiLogModel.create({ candidate_id: candidateId || null, summary, match_score: null });

  res.status(200).json({ success: true, data: { summary } });
});

// POST /api/ai/job-match
const jobMatch = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription, candidateId } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      success: false,
      message: "resumeText and jobDescription are required",
    });
  }

  const model = getModel();
  const prompt = `You are a recruitment AI. Compare this resume against the job description.
Return ONLY valid JSON, no markdown fences, in this exact shape:
{
  "matchPercentage": <number 0-100>,
  "matchingSkills": [<string>, ...],
  "missingSkills": [<string>, ...]
}

Resume:
${resumeText}

Job Description:
${jobDescription}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = extractJson(raw);

  if (!parsed) {
    return res.status(502).json({ success: false, message: "AI returned an unparseable response" });
  }

  await AiLogModel.create({
    candidate_id: candidateId || null,
    summary: null,
    match_score: parsed.matchPercentage || null,
  });

  res.status(200).json({ success: true, data: parsed });
});

// POST /api/ai/interview-questions
const interviewQuestions = asyncHandler(async (req, res) => {
  const { jobRole } = req.body;
  if (!jobRole) {
    return res.status(400).json({ success: false, message: "jobRole is required" });
  }

  const model = getModel();
  const prompt = `Generate exactly 10 technical interview questions for the role: "${jobRole}".
Return ONLY valid JSON, no markdown fences, in this exact shape:
{ "questions": [<string>, ...] }`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = extractJson(raw);

  if (!parsed) {
    return res.status(502).json({ success: false, message: "AI returned an unparseable response" });
  }

  res.status(200).json({ success: true, data: parsed });
});

module.exports = { resumeSummary, jobMatch, interviewQuestions };
