const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { donationValidationRules, validate } = require("../middleware/validators");

// Mount controller methods
router.post("/", donationValidationRules, validate, donationController.createDonation);
router.get("/", donationController.getDonations);

module.exports = router;