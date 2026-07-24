import ApiError from "../utils/ApiError.js";

/**
 * Restricts a route to specific roles. Must run after `authenticate`.
 *
 * Usage:
 *   router.delete("/:id", authenticate, authorize("admin"), controller);
 */
const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
  };

export default authorize;
