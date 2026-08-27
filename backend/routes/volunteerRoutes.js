
const express = require("express");
const router = express.Router();

// 1. Import the validation and spam protection logic
const { volunteerValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha"); // Added for spam protection 

// 2. Import the controller functions
const { registerVolunteer, getVolunteers } = require("../controllers/volunteerController");

// 3. POST: Register a new volunteer with Triple-Layer Security 
// Order: 1. Spam Check -> 2. Data Validation -> 3. Error Handling -> 4. Controller Execution
router.post("/", verifyRecaptcha, volunteerValidationRules, validate, registerVolunteer);

const { protect } = require('../middleware/authMiddleware');

// 4. GET: Fetch all volunteers (for Admin Dashboard) [cite: 92, 105]
router.get("/", protect, getVolunteers);

module.exports = router;