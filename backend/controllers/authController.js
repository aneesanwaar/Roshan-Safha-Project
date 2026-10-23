const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register an administrative user
 * @route   POST /api/auth/register
 * @access  Disabled
 *
 * Administrative accounts must be created through a
 * founder-authorized account-management workflow.
 */
exports.registerUser = async (req, res) => {
  return res.status(403).json({
    success: false,
    error: "Public administrator registration is disabled.",
  });
};

/**
 * @desc    Authenticate an existing administrative user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Validate the request before querying the database.
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: "A valid email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Reject unusually large inputs.
    if (
      normalizedEmail.length > 254 ||
      password.length > 1024
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid login credentials.",
      });
    }

    /**
     * The User model now excludes passwords from
     * queries by default.
     *
     * Explicitly retrieve the password hash only
     * for authentication.
     */
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // Use a generic error to avoid revealing account existence.
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Reject accounts that have been disabled.
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Verify the submitted password.
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Only recognized administrative roles may log in.
    const allowedRoles = ["founder", "admin", "editor"];

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "This account is not authorized for administrative access.",
      });
    }

    // Generate a JWT using our updated token utility.
    const token = generateToken(user._id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    return next(error);
  }
};