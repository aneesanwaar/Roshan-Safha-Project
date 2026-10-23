const express = require("express");

const router = express.Router();

const { loginUser } = require("../controllers/authController");

/**
 * Roshan Safha Authentication Routes
 *
 * Security:
 * Public administrator registration is disabled.
 *
 * Administrative accounts must be created through an
 * authorized provisioning process.
 */

/**
 * @route   POST /api/auth/register
 * @desc    Administrator registration is disabled
 * @access  Public (always rejected)
 */
router.post("/register", (req, res) => {
  return res.status(403).json({
    success: false,
    error: "Public administrator registration is disabled.",
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate an existing administrator
 * @access  Public
 */
router.post("/login", loginUser);

module.exports = router;