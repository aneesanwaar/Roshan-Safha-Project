const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

// Mount controller methods
router.post("/", donationController.createDonation);
router.get("/", donationController.getDonations);

module.exports = router;