const express = require("express");
const { body } = require("express-validator");
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect, authorize("admin", "recruiter"));

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  validateRequest,
  createCandidate
);

router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);

module.exports = router;
