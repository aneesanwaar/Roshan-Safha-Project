const express = require("express");
const router = express.Router();
const { contactValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");
const { protect } = require('../middleware/authMiddleware');


const { submitContactForm, getAllContacts } = require("../controllers/contactController");
// POST: Submit contact form
router.post("/", verifyRecaptcha, contactValidationRules, validate, submitContactForm);

// GET: View all messages (Admin Only)
router.get("/", protect, getAllContacts);

module.exports = router;