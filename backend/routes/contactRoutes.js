const express = require("express");
const router = express.Router();

const { contactValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");
const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

// Public: Submit inquiry
router.post("/", verifyRecaptcha, contactValidationRules, validate, submitContactForm);

// Admin: View all inquiries
router.get("/", protect, getAllContacts);

module.exports = router;