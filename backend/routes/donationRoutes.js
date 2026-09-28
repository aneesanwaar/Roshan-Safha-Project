const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

// POST /api/donations
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, city, numberOfBooks, bookTypes, dropoffMethod, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone number are required." });
    }

    const donation = await Donation.create({
      name,
      email,
      phone,
      city,
      numberOfBooks: Number(numberOfBooks) || 0,
      bookTypes,
      dropoffMethod,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Donation registered successfully.",
      data: donation
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    return res.status(500).json({ error: "Failed to submit donation." });
  }
});

module.exports = router;