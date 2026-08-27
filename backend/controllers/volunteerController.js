
const Volunteer = require("../models/Volunteer");
const sendEmail = require("../utils/emailService");

// Handle Volunteer Sign-up
exports.registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();

    // 1. Send Notification to Admin (roshanasafha@gmail.com)
    await sendEmail({
      to: 'aneesanwaar55@gmail.com',
      subject: 'New Volunteer Registered! - Roshan Safha',
      html: `<h3>New Volunteer Application</h3>
             <p><b>Name:</b> ${req.body.name}</p>
             <p><b>Age:</b> ${req.body.age}</p>
             <p><b>Email:</b> ${req.body.email}</p>
             <p><b>Phone:</b> ${req.body.phone}</p>
             <p><b>City:</b> ${req.body.city}</p>
             <p><b>Skills:</b> ${req.body.skills}</p>
             <p><b>Availability:</b> ${req.body.availability}</p>
             <p><b>Message:</b> ${req.body.message || 'No message provided'}</p>`
    });

    // 2. Send Confirmation to Submitter
    await sendEmail({
      to: req.body.email,
      subject: 'Welcome to Roshan Safha - Volunteer Registration',
      html: `<p>Dear ${req.body.name},</p>
             <p>Thank you for signing up to volunteer with us! We have received your application and will review your skills in <b>${req.body.skills}</b> shortly.</p>
             <p><i>"Roshan Safha—because second chances are for everyone and everything."</i></p>`
    });

    res.status(201).json({ message: "Volunteer registered and emails sent!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

// Get All Volunteers remains the same...
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};