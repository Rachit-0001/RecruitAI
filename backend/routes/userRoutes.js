const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);

module.exports = router;
