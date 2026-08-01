const express = require("express");
const { body } = require("express-validator");
const {
  createApplication,
  getApplications,
  updateApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect, authorize("admin", "recruiter"));

router.post(
  "/",
  [
    body("candidate_id").isInt().withMessage("candidate_id must be an integer"),
    body("job_id").isInt().withMessage("job_id must be an integer"),
  ],
  validateRequest,
  createApplication
);

router.get("/", getApplications);
router.put("/:id", updateApplication);

module.exports = router;
