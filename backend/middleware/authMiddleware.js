const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verify an administrator's JWT and load their account.
 */
const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Require the exact format: Bearer <token>
    if (typeof authorization !== "string") {
      return res.status(401).json({
        success: false,
        error: "Not authorized, no token found.",
      });
    }

    const parts = authorization.trim().split(/\s+/);

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid authorization header.",
      });
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.trim().length < 32) {
      console.error("Authentication configuration error: invalid JWT_SECRET.");

      return res.status(500).json({
        success: false,
        error: "Authentication service unavailable.",
      });
    }

    // Accept only the algorithm used by generateToken.js.
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!decoded || typeof decoded.id !== "string") {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid token.",
      });
    }

    // Retrieve the current account without its password hash.
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, account unavailable.",
      });
    }

    // Immediately reject disabled accounts.
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, account unavailable.",
      });
    }

    // Reject accounts without a recognized administrative role.
    const validRoles = ["founder", "admin", "editor"];

    if (!validRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    // Expected authentication failures.
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid or expired token.",
      });
    }

    // Invalid user IDs should not produce server errors.
    if (error.name === "CastError") {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid token.",
      });
    }

    // Unexpected failures go to the global error handler.
    return next(error);
  }
};

/**
 * Restrict access to specified administrative roles.
 *
 * Usage:
 * router.get("/example", protect, authorizeRoles("founder"), controller);
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to access this resource.",
      });
    }

    return next();
  };
};

module.exports = { protect, authorizeRoles };