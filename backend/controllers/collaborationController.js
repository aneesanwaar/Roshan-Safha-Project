const Collaboration = require("../models/Collaboration");
const sendEmail = require("../utils/emailService");

// @desc    Submit partnership / collaboration proposal
// @access  Public
exports.submitCollabForm = async (req, res) => {
  try {
    const { name, organization, email, phone, collabType, message } = req.body;

    const collab = new Collaboration({
      name,
      organization,
      email,
      phone,
      collabType,
      message
    });

    await collab.save();

    // Fast response to prevent client timeouts
    res.status(201).json({
      success: true,
      message: "Partnership request submitted successfully!",
      data: collab
    });

    // Non-blocking background email dispatch
    (async () => {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // 1. Notify Admin
        await sendEmail({
          to: adminEmail,
          subject: `New Partnership Proposal: ${organization} (${collabType})`,
          html: `
            <h3>New Collaboration Proposal</h3>
            <p><b>Organization:</b> ${organization}</p>
            <p><b>Representative:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Type:</b> ${collabType}</p>
            <p><b>Proposal:</b> ${message}</p>
          `
        });

        // 2. Notify Submitter
        await sendEmail({
          to: email,
          subject: 'Partnership Inquiry Received - Roshan Safha',
          html: `
            <p>Dear ${name},</p>
            <p>Thank you for expressing interest in collaborating with <b>Roshan Safha</b> on behalf of <b>${organization}</b>.</p>
            <p>Our team will review your proposal regarding <b>${collabType}</b> and contact you shortly at ${phone} or via this email.</p>
            <br/>
            <p><i>"Roshan Safha — because second chances are for everyone and everything."</i></p>
          `
        });
        console.log(`[EmailService] Collaboration emails dispatched for: ${collab._id}`);
      } catch (mailError) {
        console.warn("[EmailService Warning] Failed to send collaboration emails:", mailError.message);
      }
    })();

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "A proposal with this email has already been submitted." 
      });
    }

    res.status(500).json({
      success: false,
      error: "Submission failed: " + error.message
    });
  }
};

// @desc    Get all collaboration proposals
// @access  Private/Admin
exports.getAllCollabs = async (req, res) => {
  try {
    const collabs = await Collaboration.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: collabs.length,
      data: collabs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};