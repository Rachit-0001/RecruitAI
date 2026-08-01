const express = require("express");
const {
  resumeSummary,
  jobMatch,
  interviewQuestions,
} = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("admin", "recruiter"));

router.post("/resume-summary", resumeSummary);
router.post("/job-match", jobMatch);
router.post("/interview-questions", interviewQuestions);

module.exports = router;
