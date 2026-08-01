const express = require("express");
const { body } = require("express-validator");
const { createInterview, getInterviews } = require("../controllers/interviewController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect, authorize("admin", "recruiter"));

router.post(
  "/",
  [
    body("application_id").isInt().withMessage("application_id must be an integer"),
    body("interview_date").notEmpty().withMessage("interview_date is required"),
  ],
  validateRequest,
  createInterview
);

router.get("/", getInterviews);

module.exports = router;
