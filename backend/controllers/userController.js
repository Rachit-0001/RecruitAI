const UserModel = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/users (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.findAll();
  res.status(200).json({ success: true, data: users });
});

module.exports = { getUsers };
