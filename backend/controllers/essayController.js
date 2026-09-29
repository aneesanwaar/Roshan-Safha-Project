const Essay = require("../models/Essay");
const sendEmail = require("../utils/emailService");
const cloudinary = require('cloudinary').v2;

// @desc    Submit an essay for the contest
// @access  Public (Students)
exports.submitEssay = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload your essay in PDF/Doc format." });
    }

    const { 
      studentName, 
      age, 
      institutionName, 
      category, 
      email, 
      phone, 
      essayTitle, 
      hasAgreed 
    } = req.body;

    const newEssay = new Essay({
      studentName,
      age: Number(age),
      institutionName,
      category,
      email,
      phone,
      essayTitle,
      hasAgreed: hasAgreed === "true" || hasAgreed === true,
      fileUrl: req.file.path 
    });

    await newEssay.save();

    // Respond immediately to prevent client timeouts during file ingestion
    res.status(201).json({ 
      success: true,
      message: "Essay submitted successfully! Good luck.",
      data: newEssay
    });

    // Background non-blocking email notifications
    (async () => {
      try {
        const downloadUrl = req.file.path.replace("/upload/", "/upload/fl_attachment/");
        const adminEmail = process.env.ADMIN_EMAIL || 'aneesanwaar55@gmail.com';

        // 1. Notify Admin
        await sendEmail({
          to: adminEmail, 
          subject: `New Essay Contest Entry: ${essayTitle}`,
          html: `
            <h3>New Essay Submission</h3>
            <p><b>Participant:</b> ${studentName} (${age} years old)</p>
            <p><b>Category:</b> ${category}</p>
            <p><b>Institution:</b> ${institutionName}</p>
            <p><b>Title:</b> ${essayTitle}</p>
            <p><b>View/Download File:</b> <a href="${downloadUrl}">Click Here to Download</a></p>
          `
        });

        // 2. Notify Student
        await sendEmail({
          to: email,
          subject: 'Essay Submission Confirmed - Roshan Safha',
          html: `
            <p>Dear ${studentName},</p>
            <p>We have successfully received your essay titled <b>"${essayTitle}"</b>.</p>
            <p>Our judges will review all submissions after the contest deadline. Good luck!</p>
            <p>Best regards,<br><b>The Roshan Safha Team</b></p>
          `
        });
        console.log(`[EmailService] Essay submission emails sent for: ${newEssay._id}`);
      } catch (mailErr) {
        console.warn("[EmailService Warning] Failed to send essay notification emails:", mailErr.message);
      }
    })();

  } catch (error) {
    // Cloudinary cleanup if database insertion fails
    if (req && req.file && req.file.path) {
      try {
        const publicId = req.file.path.split('/').slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log("Cleanup: Deleted failed upload from Cloudinary");
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup failed:", cloudinaryError);
      }
    }

    // if (error.code === 11000) {
    //   return res.status(400).json({ error: "This email has already submitted an essay." });
    // }

    res.status(500).json({ error: "Submission failed: " + error.message });
  }
};

// @desc    Get all essays for Admin review
// @access  Private/Admin
exports.getAllEssays = async (req, res) => {
  try {
    const essays = await Essay.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: essays.length, data: essays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update essay status (Admin only)
// @route   PATCH /api/essays/:id/status
exports.updateEssayStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Reviewed", "Winner"];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Choose Pending, Reviewed, or Winner." });
    }

    const updatedEssay = await Essay.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedEssay) {
      return res.status(404).json({ error: "Essay submission not found." });
    }

    res.status(200).json({ 
      success: true,
      message: `Status updated to ${status} successfully!`, 
      data: updatedEssay 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};