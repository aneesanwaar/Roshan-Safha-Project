const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { donationValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Mount controller methods
router.post("/", verifyRecaptcha, donationValidationRules, validate, donationController.createDonation);
// Donor contact details are private. Never expose the list to public visitors.
// Preserve access for existing recognized admin roles until the role policy is finalized.
router.get("/", protect, authorizeRoles("founder", "admin", "editor"), donationController.getDonations);

module.exports = router;