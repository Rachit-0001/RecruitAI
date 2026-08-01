const ApplicationModel = require("../models/applicationModel");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/applications
const createApplication = asyncHandler(async (req, res) => {
  const { candidate_id, job_id, status } = req.body;
  const id = await ApplicationModel.create({ candidate_id, job_id, status });
  const application = await ApplicationModel.findById(id);
  res.status(201).json({ success: true, message: "Application created", data: application });
});

// GET /api/applications
const getApplications = asyncHandler(async (req, res) => {
  const applications = await ApplicationModel.findAll();
  res.status(200).json({ success: true, count: applications.length, data: applications });
});

// PUT /api/applications/:id
const updateApplication = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await ApplicationModel.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }
  await ApplicationModel.updateStatus(req.params.id, status);
  const updated = await ApplicationModel.findById(req.params.id);
  res.status(200).json({ success: true, message: "Application updated", data: updated });
});

module.exports = { createApplication, getApplications, updateApplication };
