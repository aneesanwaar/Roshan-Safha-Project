const express = require("express");
const router = express.Router();
const { eventValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");
const { registerForEvent, getAllRegistrations } = require("../controllers/eventController");
const { protect } = require('../middleware/authMiddleware');


router.post("/", verifyRecaptcha, eventValidationRules, validate, registerForEvent);
router.get("/", protect, getAllRegistrations);

module.exports = router;