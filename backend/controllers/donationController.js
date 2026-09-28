const Donation = require("../models/Donation");
const sendEmail = require("../utils/emailService");

// POST /api/donations
exports.createDonation = async (req, res) => {
  try {
    const { name, email, phone, city, numberOfBooks, bookTypes, dropoffMethod, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: "Name, email, and phone number are required." 
      });
    }

    // 1. Save directly to MongoDB
    const donation = await Donation.create({
      name,
      email,
      phone,
      city: city || "Muzaffarabad",
      numberOfBooks: Number(numberOfBooks) || 0,
      bookTypes: bookTypes || "General",
      dropoffMethod: dropoffMethod || "Drop-off",
      message: message || ""
    });

    // 2. Respond immediately to the frontend
    res.status(201).json({
      success: true,
      message: "Donation registered successfully.",
      data: donation
    });

    // 3. Asynchronously trigger emails in background (non-blocking)
    (async () => {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // Email to Admin
        await sendEmail({
          to: adminEmail,
          subject: 'New Book Donation Received! - Roshan Safha',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #059669;">New Book Donation Received</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px; font-weight: bold;">Donor Name:</td><td>${donation.name}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td>${donation.email}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Phone:</td><td>${donation.phone}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">City:</td><td>${donation.city}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Books:</td><td>${donation.numberOfBooks}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Categories:</td><td>${donation.bookTypes}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Method:</td><td>${donation.dropoffMethod}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Notes:</td><td>${donation.message || 'None'}</td></tr>
              </table>
            </div>
          `
        });

        // Confirmation Email to Donor
        await sendEmail({
          to: donation.email,
          subject: 'Thank you for your book pledge - Roshan Safha',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #059669;">Thank You, ${donation.name}!</h2>
              <p>Your pledge to donate <strong>${donation.numberOfBooks} books</strong> has been recorded.</p>
              <p>Our volunteer coordination team will contact you via WhatsApp/Phone at <strong>${donation.phone}</strong> to coordinate collection or drop-off.</p>
              <br/>
              <p style="font-style: italic; color: #047857;">"Roshan Safha — because second chances are for everyone and everything."</p>
            </div>
          `
        });
        console.log(`[EmailService] Notifications dispatched for donation: ${donation._id}`);
      } catch (mailErr) {
        console.warn("[EmailService Warning] Failed to send donation email:", mailErr.message);
      }
    })();

  } catch (error) {
    console.error("Donation creation error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Operation failed: " + error.message 
    });
  }
};

// GET /api/donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};