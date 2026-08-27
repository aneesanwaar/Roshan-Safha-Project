const express = require("express");
const router = express.Router();
const { collabValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");
const { submitCollabForm, getAllCollabs } = require("../controllers/collaborationController");
const { protect } = require('../middleware/authMiddleware');

router.post("/", verifyRecaptcha, collabValidationRules, validate, submitCollabForm);
router.get("/", protect, getAllCollabs);

module.exports = router;