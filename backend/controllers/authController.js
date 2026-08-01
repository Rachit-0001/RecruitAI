const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = await UserModel.create({
    name,
    email,
    hashedPassword,
    role: role === "admin" ? "admin" : "recruiter",
  });

  const user = await UserModel.findById(userId);
  const token = generateToken({ id: user.id, role: user.role });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken({ id: user.id, role: user.role });
  const { password: _pw, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: userWithoutPassword, token },
  });
});

// GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = { register, login, getProfile };
