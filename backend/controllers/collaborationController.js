const Collaboration = require("../models/Collaboration");
const sendEmail = require("../utils/emailService");

exports.submitCollabForm = async (req, res) => {
  try {
    const collab = new Collaboration(req.body);
    await collab.save();

    // 1. Notify Admin
    await sendEmail({
      to: 'aneesanwaar55@gmail.com', // Updated to your provided admin email
      subject: `New Partnership Proposal: ${req.body.collabType}`,
      html: `<h3>New Collaboration Inquiry</h3>
             <p><b>Organization:</b> ${req.body.organization}</p>
             <p><b>Contact Person:</b> ${req.body.name}</p>
             <p><b>Type:</b> ${req.body.collabType}</p>
             <p><b>Message:</b> ${req.body.message}</p>`
    });

    // 2. Notify Potential Partner (The Submitter)
    await sendEmail({
      to: req.body.email,
      subject: 'Partnership Inquiry Received - Roshan Safha',
      html: `<p>Dear ${req.body.name},</p>
             <p>Thank you for expressing interest in collaborating with <b>Roshan Safha</b>.</p>
             <p>Our partnership team will review your proposal regarding <b>${req.body.collabType}</b> and reach out to you shortly to discuss how we can work together.</p>
             <p>Best regards,<br>The Roshan Safha Team</p>`
    });

    res.status(201).json({ message: "Proposal submitted successfully!" });

  } catch (error) {
    // Check for MongoDB Duplicate Key Error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "A proposal with this email has already been submitted. We will get back to you soon!" 
      });
    }

    // General Server Error
    res.status(500).json({ error: "Submission failed: " + error.message });
  }
};

exports.getAllCollabs = async (req, res) => {
  try {
    const collabs = await Collaboration.find().sort({ createdAt: -1 });
    res.status(200).json(collabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};