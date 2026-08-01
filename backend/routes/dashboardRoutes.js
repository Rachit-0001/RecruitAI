const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin", "recruiter"), getDashboard);

module.exports = router;
