const InterviewModel = require("../models/interviewModel");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/interviews
const createInterview = asyncHandler(async (req, res) => {
  const { application_id, interview_date, interviewer, result } = req.body;
  const id = await InterviewModel.create({ application_id, interview_date, interviewer, result });
  res.status(201).json({ success: true, message: "Interview scheduled", data: { id } });
});

// GET /api/interviews
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await InterviewModel.findAll();
  res.status(200).json({ success: true, count: interviews.length, data: interviews });
});

module.exports = { createInterview, getInterviews };
