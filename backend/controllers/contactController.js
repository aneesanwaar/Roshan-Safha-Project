const Contact = require("../models/Contact");
const sendEmail = require("../utils/emailService");

exports.submitContactForm = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // 1. Notify Admin (roshanasafha@gmail.com)
    await sendEmail({
      to: 'aneesanwaar55@gmail.com',
      subject: `New Contact Inquiry: ${req.body.subject}`,
      html: `<h3>New Message from Website</h3>
             <p><b>From:</b> ${req.body.name} (${req.body.email})</p>
             <p><b>Subject:</b> ${req.body.subject}</p>
             <p><b>Message:</b> ${req.body.message}</p>`
    });

    // 2. Notify Submitter (The User)
    await sendEmail({
      to: req.body.email,
      subject: 'We received your message - Roshan Safha',
      html: `<p>Dear ${req.body.name},</p>
             <p>Thank you for reaching out to Roshan Safha. We have received your inquiry regarding <b>"${req.body.subject}"</b>.</p>
             <p>Our team will review your message and get back to you as soon as possible.</p>
             <br>
             <p><i>"Roshan Safha—because second chances are for everyone and everything."</i></p>`
    });

    res.status(201).json({ message: "Message sent successfully! Confirmation email dispatched." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message: " + error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    // Sort by createdAt: -1 means "Newest First"
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages: " + error.message });
  }
};
