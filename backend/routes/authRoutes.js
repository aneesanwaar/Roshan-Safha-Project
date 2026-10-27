const express = require("express");

const { loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Public registration is disabled.
 *
 * Administrator accounts must be created through
 * an authorized provisioning process.
 */
router.post("/register", (req, res) => {
  return res.status(403).json({
    success: false,
    error: "Public administrator registration is disabled.",
  });
});

/**
 * POST /api/auth/login
 *
 * Authenticate an administrator and issue a JWT.
 */
router.post("/login", loginUser);

/**
 * GET /api/auth/me
 *
 * Verify the supplied JWT and return the current
 * authenticated administrator's profile.
 *
 * The protect middleware verifies:
 * - JWT signature and expiration
 * - Account existence
 * - Active account status
 * - Administrative role
 */
router.get("/me", protect, (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    admin: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;