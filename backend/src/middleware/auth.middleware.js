import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

/**
 * Verifies the Bearer JWT, attaches the authenticated user (minus password)
 * to req.user, and rejects the request otherwise.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("No authentication token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw ApiError.unauthorized(
      error.name === "TokenExpiredError" ? "Session expired, please log in again" : "Invalid authentication token"
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }

  req.user = user;
  next();
});
