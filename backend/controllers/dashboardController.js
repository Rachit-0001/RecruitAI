const { pool } = require("../config/db");
const JobModel = require("../models/jobModel");
const ApplicationModel = require("../models/applicationModel");
const InterviewModel = require("../models/interviewModel");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const [[{ totalCandidates }]] = await pool.query(
    "SELECT COUNT(*) AS totalCandidates FROM candidates"
  );

  const openJobs = await JobModel.count();
  const totalApplications = await ApplicationModel.countTotal();
  const totalInterviews = await InterviewModel.countTotal();
  const statusCounts = await ApplicationModel.countByStatus();
  const applicationsPerMonth = await ApplicationModel.perMonth();

  const selected = statusCounts.find((s) => s.status === "selected")?.count || 0;
  const rejected = statusCounts.find((s) => s.status === "rejected")?.count || 0;
  const hiringRate =
    totalApplications > 0 ? Number(((selected / totalApplications) * 100).toFixed(2)) : 0;

  res.status(200).json({
    success: true,
    data: {
      totalCandidates,
      openJobs,
      totalApplications,
      totalInterviews,
      selectedCandidates: selected,
      rejectedCandidates: rejected,
      hiringRate,
      charts: {
        applicationsPerMonth,
        candidateStatus: statusCounts,
      },
    },
  });
});

module.exports = { getDashboard };
