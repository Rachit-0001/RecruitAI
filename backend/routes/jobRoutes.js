const express = require("express");
const { body } = require("express-validator");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect, authorize("admin", "recruiter"));

router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validateRequest,
  createJob
);

router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
