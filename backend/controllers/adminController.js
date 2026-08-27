const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");
const Event = require("../models/Event"); 
const Essay = require("../models/Essay");

// @desc    Get counts of all submissions for the Dashboard Summary
// @route   GET /api/admin/stats
// @access  Private (Admin Only)

exports.getDashboardStats = async (req, res) => {
  try {
    const [volunteerCount, eventCount, essayCount] = await Promise.all([
      Volunteer.countDocuments(),
      Event.countDocuments(),
      Essay.countDocuments(),
    ]);

    // Calculate the SUM of all books donated across all forms
    const bookData = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: "$numberOfBooks" } // Sums up the 'numberOfBooks' field
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks: bookData.length > 0 ? bookData[0].totalBooks : 0,
        totalVolunteers: volunteerCount,
        totalEvents: eventCount,
        totalEssays: essayCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
