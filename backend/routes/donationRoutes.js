const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { donationValidationRules, validate } = require("../middleware/validators");
const verifyRecaptcha = require("../middleware/recaptcha");

// Mount controller methods
router.post("/", verifyRecaptcha, donationValidationRules, validate, donationController.createDonation);
router.get("/", donationController.getDonations);

module.exports = router;