import env from "../config/env.js";
import logger from "../utils/logger.js";

/**
 * 404 handler — placed after all routes in app.js.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized error handler. Every thrown ApiError (or unexpected error)
 * funnels through here via asyncHandler's next(err) call.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const isOperational = err.isOperational ?? false;

  if (!isOperational) {
    logger.error(err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
    stack: env.IS_PROD ? undefined : err.stack,
  });
};
