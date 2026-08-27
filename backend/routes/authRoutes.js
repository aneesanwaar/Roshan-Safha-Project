const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");

// Endpoints: /api/auth/register and /api/auth/login
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;