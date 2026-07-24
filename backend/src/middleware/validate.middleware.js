import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Runs after an array of express-validator checks. Collects and formats
 * any validation errors into a single ApiError(400).
 *
 * Usage:
 *   router.post("/", [body("email").isEmail(), ...], validate, controller);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(ApiError.badRequest("Validation failed", formatted));
  }

  next();
};

export default validate;
