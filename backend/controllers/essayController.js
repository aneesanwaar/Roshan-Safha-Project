const Essay = require("../models/Essay");
const sendEmail = require("../utils/emailService");
const cloudinary = require('cloudinary').v2; // Required for cleanup if needed

// @desc    Submit an essay for the contest
// @access  Public (Students)
exports.submitEssay = async (req, res) => {
  try {
    
    // // Log this to your VS Code terminal to see if the file is arriving
    // console.log("File received from Cloudinary:", req.file ? req.file.path : "NULL");
    
    // 1. Check if Cloudinary successfully uploaded the file
    if (!req.file) {
      return res.status(400).json({ error: "Please upload your essay in PDF/Doc format." });
    }
    
    const downloadUrl = req.file.path.replace("/upload/", "/upload/fl_attachment/");
    
    // 2. Extract fields exactly as named in your NEW Schema
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

    // 3. Create the record using the Cloudinary URL (req.file.path)
    const newEssay = new Essay({
      studentName,
      age,
      institutionName,
      category,
      email,
      phone,
      essayTitle,
      hasAgreed: hasAgreed === "true" || hasAgreed === true, // Handles form-data string conversion
      fileUrl: req.file.path 
    });

    await newEssay.save();

    // 4. Notify Admin (Aamna)
    // Using the recipient you specified
    await sendEmail({
      to: 'aneesanwaar55@gmail.com', 
      subject: `New Essay Contest Entry: ${essayTitle}`,
      html: `<h3>New Essay Submission</h3>
             <p><b>Participant:</b> ${studentName} (${age} years old)</p>
             <p><b>Category:</b> ${category}</p>
             <p><b>Institution:</b> ${institutionName}</p>
             <p><b>Title:</b> ${essayTitle}</p>
             <p><b>View/Download File:</b> <a href="${downloadUrl}">Click Here</a></p>`
    });

    // 5. Notify Student
    await sendEmail({
      to: email,
      subject: 'Essay Submission Confirmed - Roshan Safha',
      html: `<p>Dear ${studentName},</p>
             <p>We have successfully received your essay titled <b>"${essayTitle}"</b>.</p>
             <p>Our judges will review all submissions after the contest deadline. Good luck!</p>
             <p>Best regards,<br><b>The Roshan Safha Team</b></p>`
    });

    res.status(201).json({ message: "Essay submitted successfully! Good luck." });

  } catch (error) {
    // ⚠️ Updated Cleanup Logic:
    // Only try to delete from Cloudinary if the file was actually uploaded 
    // AND if it has a path property.
    if (req && req.file && req.file.path) {
      try {
        const publicId = req.file.path.split('/').slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log("Cleanup: Deleted failed upload from Cloudinary");
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup failed:", cloudinaryError);
      }
    }

    if (error.code === 11000) {
      return res.status(400).json({ error: "This email has already submitted an essay." });
    }

    res.status(500).json({ error: "Submission failed: " + error.message });
  }

};
// @desc    Get all essays for Admin review
// @access  Private/Admin
exports.getAllEssays = async (req, res) => {
  try {
    // Using 'createdAt' from timestamps since 'submittedAt' isn't in your schema
    const essays = await Essay.find().sort({ createdAt: -1 });
    res.status(200).json(essays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single essay by ID for Admin review
// @desc    Update essay status (Admin only)
// @route   PATCH /api/essays/:id/status
exports.updateEssayStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate that the status is one of our allowed options
    const allowedStatuses = ["Pending", "Reviewed", "Winner"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Choose Pending, Reviewed, or Winner." });
    }

    const updatedEssay = await Essay.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true } // ✅ New way
    );

    if (!updatedEssay) {
      return res.status(404).json({ error: "Essay submission not found." });
    }

    res.status(200).json({ 
      message: `Status updated to ${status} successfully!`, 
      essay: updatedEssay 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};