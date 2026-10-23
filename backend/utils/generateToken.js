const jwt = require("jsonwebtoken");

/**
 * Generate a JWT for an authenticated administrator.
 *
 * Security features:
 * - Explicit HS256 signing algorithm
 * - Eight-hour token expiration
 * - Minimal token payload
 * - JWT secret configuration validation
 */

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters."
    );
  }

  if (!id) {
    throw new Error("A valid user ID is required to generate a token.");
  }

  return jwt.sign(
    { id: String(id) },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "8h",
    }
  );
};

module.exports = generateToken;