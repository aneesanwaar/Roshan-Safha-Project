
const express = require("express");
const router = express.Router();

// 1. Import the validation logic
const { donationValidationRules, validate } = require("../middleware/validators");

// 2. Import spam protection middleware
const verifyRecaptcha = require("../middleware/recaptcha");

// 3. Import the controller functions
const { createDonation, getDonations } = require("../controllers/donationController");

const { protect } = require('../middleware/authMiddleware'); // Import the guard

// 4. Test route
router.get("/test", (req, res) => {
  res.send("Donation route working");
});

// 5. POST route with Triple-Layer Security 
// Order: Spam Check -> Data Validation -> Error Handling -> Controller Execution
router.post("/", verifyRecaptcha, donationValidationRules, validate, createDonation);

// 6. GET route to fetch all donations
router.get("/", protect, getDonations);

module.exports = router;