const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new admin (Founder)
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    // Create user (The Model's .pre('save') hook will encrypt the password automatically)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // Send the digital key immediately
      });
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
    // Instead of res.status, pass the error to the global error handler
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Use the .matchPassword() method we created in the Model
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
    // Instead of res.status, pass the error to the global error handler
    next(error);
  }
};