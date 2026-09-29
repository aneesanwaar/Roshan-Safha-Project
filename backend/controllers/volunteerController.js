const Volunteer = require("../models/Volunteer");
const sendEmail = require("../utils/emailService");

// @desc    Register a volunteer
// @access  Public
exports.registerVolunteer = async (req, res) => {
  try {
    const { name, age, email, phone, city, skills, availability, message } = req.body;

    const volunteer = new Volunteer({
      name,
      age: Number(age),
      email,
      phone,
      city,
      skills,
      availability,
      message
    });

    await volunteer.save();

    // Respond immediately to avoid client timeouts
    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully!",
      data: volunteer
    });

    // Non-blocking transactional emails
    (async () => {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // 1. Admin Alert
        await sendEmail({
          to: adminEmail,
          subject: `New Volunteer Registered: ${name} (${city})`,
          html: `
            <h3>New Volunteer Application</h3>
            <p><b>Name:</b> ${name}</p>
            <p><b>Age:</b> ${age}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>City:</b> ${city}</p>
            <p><b>Skills:</b> ${skills}</p>
            <p><b>Availability:</b> ${availability}</p>
            <p><b>Message:</b> ${message || 'No additional message provided'}</p>
          `
        });

        // 2. Submitter Confirmation
        await sendEmail({
          to: email,
          subject: 'Welcome to Roshan Safha - Volunteer Registration Confirmed',
          html: `
            <p>Dear ${name},</p>
            <p>Thank you for signing up to volunteer with us! We have received your application and will review your profile for opportunities in <b>${skills}</b>.</p>
            <p>Our team will contact you at ${phone} or via this email for upcoming literacy drives in ${city}.</p>
            <br/>
            <p><i>"Roshan Safha — because second chances are for everyone and everything."</i></p>
          `
        });
        console.log(`[EmailService] Volunteer emails dispatched for: ${volunteer._id}`);
      } catch (mailError) {
        console.warn("[EmailService Warning] Failed to send volunteer notification emails:", mailError.message);
      }
    })();

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Registration failed: " + error.message
    });
  }
};

// @desc    Get all volunteers
// @access  Private/Admin
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};