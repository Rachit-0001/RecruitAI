const JobModel = require("../models/jobModel");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const { title, description, required_skills, location, salary } = req.body;
  const id = await JobModel.create({
    title,
    description,
    required_skills,
    location,
    salary,
    created_by: req.user.id,
  });
  const job = await JobModel.findById(id);
  res.status(201).json({ success: true, message: "Job created", data: job });
});

// GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const jobs = await JobModel.findAll({ status });
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, data: job });
});

// PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  await JobModel.update(req.params.id, req.body);
  const updated = await JobModel.findById(req.params.id);
  res.status(200).json({ success: true, message: "Job updated", data: updated });
});

// DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  await JobModel.delete(req.params.id);
  res.status(200).json({ success: true, message: "Job deleted" });
});

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
