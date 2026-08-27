const Event = require("../models/Event");
const sendEmail = require("../utils/emailService");

exports.registerForEvent = async (req, res) => {
  try {
    const registration = new Event(req.body);
    await registration.save();

    // 1. Notify Admin
    await sendEmail({
      to: 'aneesanwaar55@gmail.com',
      subject: `New Registration: ${req.body.eventName}`,
      html: `<h3>New Event Registration</h3>
             <p><b>Event:</b> ${req.body.eventName}</p>
             <p><b>Name:</b> ${req.body.name}</p>
             <p><b>Attendees:</b> ${req.body.attendees}</p>
             <p><b>Contact:</b> ${req.body.phone} (${req.body.email})</p>`
    });

    // 2. Notify Participant
    await sendEmail({
      to: req.body.email,
      subject: `Confirmed: Your spot at ${req.body.eventName}`,
      html: `<p>Hi ${req.body.name},</p>
             <p>Your registration for <b>${req.body.eventName}</b> is confirmed!</p>
             <p>We look forward to seeing you (and your group of ${req.body.attendees}) there.</p>
             <p>Best regards,<br>The Roshan Safha Team</p>`
    });

    res.status(201).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

// GET service for Admin Dashboard
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};