const CandidateModel = require("../models/candidateModel");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/candidates
const createCandidate = asyncHandler(async (req, res) => {
  const { name, email, phone, skills, experience, education, resume } = req.body;
  const id = await CandidateModel.create({
    name,
    email,
    phone,
    skills,
    experience,
    education,
    resume,
    created_by: req.user.id,
  });
  const candidate = await CandidateModel.findById(id);
  res.status(201).json({ success: true, message: "Candidate created", data: candidate });
});

// GET /api/candidates
const getCandidates = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const candidates = await CandidateModel.findAll({ search });
  res.status(200).json({ success: true, count: candidates.length, data: candidates });
});

// GET /api/candidates/:id
const getCandidateById = asyncHandler(async (req, res) => {
  const candidate = await CandidateModel.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }
  res.status(200).json({ success: true, data: candidate });
});

// PUT /api/candidates/:id
const updateCandidate = asyncHandler(async (req, res) => {
  const candidate = await CandidateModel.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }
  await CandidateModel.update(req.params.id, req.body);
  const updated = await CandidateModel.findById(req.params.id);
  res.status(200).json({ success: true, message: "Candidate updated", data: updated });
});

// DELETE /api/candidates/:id
const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await CandidateModel.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }
  await CandidateModel.delete(req.params.id);
  res.status(200).json({ success: true, message: "Candidate deleted" });
});

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
