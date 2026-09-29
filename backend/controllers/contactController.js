const Contact = require("../models/Contact");
const sendEmail = require("../utils/emailService");

// @desc    Submit general contact inquiry
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    // Fast response to prevent client timeouts
    res.status(201).json({
      success: true,
      message: "Message sent! Our team will reply shortly.",
      data: contact
    });

    // Non-blocking transactional emails
    (async () => {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // 1. Notify Admin
        await sendEmail({
          to: adminEmail,
          subject: `New Contact Inquiry: ${subject}`,
          html: `
            <h3>New Message from Website</h3>
            <p><b>From:</b> ${name} (${email})</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b> ${message}</p>
          `
        });

        // 2. Submitter Confirmation
        await sendEmail({
          to: email,
          subject: 'We received your message - Roshan Safha',
          html: `
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Roshan Safha. We have received your inquiry regarding <b>"${subject}"</b>.</p>
            <p>Our team will review your message and get back to you as soon as possible.</p>
            <br>
            <p><i>"Roshan Safha — because second chances are for everyone and everything."</i></p>
          `
        });
        console.log(`[EmailService] Contact inquiry emails dispatched for: ${contact._id}`);
      } catch (mailError) {
        console.warn("[EmailService Warning] Failed to send contact inquiry emails:", mailError.message);
      }
    })();

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to send message: " + error.message
    });
  }
};

// @desc    Get all contact inquiries
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages: " + error.message
    });
  }
};