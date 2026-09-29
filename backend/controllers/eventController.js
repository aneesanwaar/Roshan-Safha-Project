const Event = require("../models/Event");
const sendEmail = require("../utils/emailService");

// @desc    Register for an event
// @access  Public
exports.registerForEvent = async (req, res) => {
  try {
    const { name, email, phone, eventName, attendees, message } = req.body;

    const registration = new Event({
      name,
      email,
      phone,
      eventName,
      attendees: Number(attendees) || 1,
      message
    });

    await registration.save();

    // Fast response to prevent client timeouts
    res.status(201).json({
      success: true,
      message: `Registration confirmed for ${eventName}!`,
      data: registration
    });

    // Non-blocking transactional email dispatches
    (async () => {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // 1. Notify Admin
        await sendEmail({
          to: adminEmail,
          subject: `New Event Registration: ${eventName} (${name})`,
          html: `
            <h3>New Event Registration</h3>
            <p><b>Event:</b> ${eventName}</p>
            <p><b>Attendee Name:</b> ${name}</p>
            <p><b>Total Attendees:</b> ${registration.attendees}</p>
            <p><b>Contact Phone:</b> ${phone}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Note:</b> ${message || 'None'}</p>
          `
        });

        // 2. Notify Participant
        await sendEmail({
          to: email,
          subject: `Registration Confirmed: ${eventName} - Roshan Safha`,
          html: `
            <p>Dear ${name},</p>
            <p>Your registration for <b>${eventName}</b> is confirmed!</p>
            <p>We have reserved spots for a group of <b>${registration.attendees}</b> attendee(s).</p>
            <p>If you have any questions or require updates, please reply directly to this email or reach us at ${phone}.</p>
            <br/>
            <p><i>"Roshan Safha — because second chances are for everyone and everything."</i></p>
          `
        });
        console.log(`[EmailService] Event registration emails sent for: ${registration._id}`);
      } catch (mailError) {
        console.warn("[EmailService Warning] Failed to send event registration emails:", mailError.message);
      }
    })();

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Registration failed: " + error.message
    });
  }
};

// @desc    Get all event registrations
// @access  Private/Admin
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};