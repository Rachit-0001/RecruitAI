
const ai = require("../config/gemini");
const AiLogModel = require("../models/aiLogModel");
const asyncHandler = require("../utils/asyncHandler");

// Gemini model configuration
const GEMINI_MODEL =
  process.env.GEMINI_MODEL;

// ================= Helper: Delay =================

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ================= Helper: Generate AI Content =================

async function generateAI(prompt) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = result.text;

      if (!text || !text.trim()) {
        throw new Error("Gemini returned an empty response");
      }

      return text.trim();
    } catch (error) {
      const status =
        error.status ||
        error.statusCode ||
        error.code;

      const retryableStatuses = [
        429, 500, 502, 503, 504,
        "429",
        "500",
        "502",
        "503",
        "504",
      ];

      const isRetryable = retryableStatuses.includes(status);

      console.error(
        `Gemini API attempt ${attempt}/${maxAttempts} failed:`,
        error.message
      );

      if (!isRetryable || attempt === maxAttempts) {
        const finalError = new Error(
          isRetryable
            ? "Gemini AI is temporarily unavailable. Please try again later."
            : error.message || "Gemini API request failed."
        );

        finalError.statusCode = isRetryable ? 503 : 502;
        throw finalError;
      }

      // Exponential backoff: 1.5s, 3s
      await delay(1500 * Math.pow(2, attempt - 1));
    }
  }
}

// ================= Helper: Extract JSON =================

function extractJson(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try parsing the complete response
  try {
    return JSON.parse(cleaned);
  } catch {
    // Extract JSON object from surrounding text
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(cleaned.substring(start, end + 1));
    } catch {
      return null;
    }
  }
}

// ================= Resume Summary =================

const resumeSummary = asyncHandler(async (req, res) => {
  const { resumeText, candidateId } = req.body;

  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({
      success: false,
      message: "resumeText is required",
    });
  }

  const prompt = `
You are an AI recruitment assistant.

Write a concise professional summary of 3-4 sentences
based on the following resume.

Do not invent qualifications or experience.

Resume:
${resumeText}
`;

  const summary = await generateAI(prompt);

  await AiLogModel.create({
    candidate_id: candidateId || null,
    summary,
    match_score: null,
  });

  return res.json({
    success: true,
    data: {
      summary,
    },
  });
});

// ================= Job Match =================

const jobMatch = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription, candidateId } = req.body;

  if (
    !resumeText ||
    !resumeText.trim() ||
    !jobDescription ||
    !jobDescription.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "resumeText and jobDescription are required",
    });
  }

  const prompt = `
Compare the candidate's resume against the job description.

Return ONLY valid JSON.
Do not include markdown or explanations.

Required JSON structure:
{
  "matchPercentage": 90,
  "matchingSkills": [],
  "missingSkills": []
}

matchPercentage must be a number between 0 and 100.
matchingSkills and missingSkills must be arrays of strings.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const raw = await generateAI(prompt);
  const parsed = extractJson(raw);

  if (
    !parsed ||
    typeof parsed.matchPercentage !== "number" ||
    !Array.isArray(parsed.matchingSkills) ||
    !Array.isArray(parsed.missingSkills)
  ) {
    return res.status(502).json({
      success: false,
      message: "AI returned an invalid job match response. Please try again.",
    });
  }

  await AiLogModel.create({
    candidate_id: candidateId || null,
    summary: null,
    match_score: parsed.matchPercentage,
  });

  return res.json({
    success: true,
    data: parsed,
  });
});

// ================= Interview Questions =================

const interviewQuestions = asyncHandler(async (req, res) => {
  const { jobRole } = req.body;

  if (!jobRole || !jobRole.trim()) {
    return res.status(400).json({
      success: false,
      message: "jobRole is required",
    });
  }

  const prompt = `
Generate exactly 10 relevant technical interview questions
for the following job role:

${jobRole}

Return ONLY valid JSON.
Do not include markdown or explanations.

Required structure:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
    "Question 6",
    "Question 7",
    "Question 8",
    "Question 9",
    "Question 10"
  ]
}

The questions must be technically relevant to the role.
`;

  const raw = await generateAI(prompt);
  const parsed = extractJson(raw);

  if (
    !parsed ||
    !Array.isArray(parsed.questions) ||
    parsed.questions.length !== 10 ||
    !parsed.questions.every((q) => typeof q === "string")
  ) {
    return res.status(502).json({
      success: false,
      message: "AI returned invalid interview questions. Please try again.",
    });
  }

  return res.json({
    success: true,
    data: parsed,
  });
});

// ================= Exports =================

module.exports = {
  resumeSummary,
  jobMatch,
  interviewQuestions,
};
