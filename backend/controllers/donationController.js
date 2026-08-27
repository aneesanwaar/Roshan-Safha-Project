
const Donation = require("../models/Donation");
const sendEmail = require("../utils/emailService");

// Function 1: Create (Handles DB save and two required emails)
exports.createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    // 1. Send Notification to Admin
    await sendEmail({
      to: 'aneesanwaar55@gmail.com',
      subject: 'New Book Donation Received! - Roshan Safha',
      html: `<h3>New Donation Details</h3>
             <p><b>Name:</b> ${req.body.name}</p>
             <p><b>Email:</b> ${req.body.email}</p>
             <p><b>Phone:</b> ${req.body.phone}</p>
             <p><b>Books:</b> ${req.body.numberOfBooks}</p>
             <p><b>City:</b> ${req.body.city}</p>
             <p><b>Method:</b> ${req.body.dropoffMethod}</p>
             <p><b>Message:</b> ${req.body.message}</p>`
    });

    // 2. Send Confirmation to Submitter
    await sendEmail({
      to: req.body.email,
      subject: 'Thank you for your donation - Roshan Safha',
      html: `<p>Dear ${req.body.name},</p>
             <p>Thank you for donating ${req.body.numberOfBooks} books to Roshan Safha.</p> 
             <p><i>"Roshan Safha—because second chances are for everyone and everything."</i></p>`
    });

    res.status(201).json({ message: "Donation submitted and emails sent!" });
  } catch (error) {
    res.status(500).json({ error: "Operation failed: " + error.message });
  }
};

// Function 2: Get All
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};