const Donation = require("../models/Donation");
const Essay = require("../models/Essay");
const Volunteer = require("../models/Volunteer");
const Collaboration = require("../models/Collaboration");
const Event = require("../models/Event");
const Contact = require("../models/Contact");
const User = require("../models/User");
const SiteContent = require("../models/SiteContent");
const Winner = require("../models/Winner");

// --- Helper: Least-Squares Linear Regression Engine ---
const calculateLinearRegression = (dataArray, key) => {
  const n = dataArray.length;
  if (n === 0) return { slope: 0, intercept: 0, forecastNext: 0, growthRate: 0, trend: "Stable" };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    const y = dataArray[i][key] || 0;
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / (n || 1);
  const forecastNext = Math.round(slope * n + intercept);

  const initialVal = dataArray[0][key] || 1;
  const latestVal = dataArray[n - 1][key] || 0;
  const growthRate = Math.round(((latestVal - initialVal) / initialVal) * 100);

  return {
    slope: parseFloat(slope.toFixed(2)),
    intercept: parseFloat(intercept.toFixed(2)),
    forecastNext: Math.max(0, forecastNext),
    growthRate,
    trend: slope > 5 ? "High Acceleration" : slope > 0 ? "Steady Growth" : "Decline"
  };
};

// 1. GET /api/admin/stats (Dashboard High-Level Counts)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalDonations,
      totalEssays,
      totalVolunteers,
      totalCollabs,
      totalEvents,
      totalContacts
    ] = await Promise.all([
      Donation.countDocuments(),
      Essay.countDocuments(),
      Volunteer.countDocuments(),
      Collaboration.countDocuments(),
      Event.countDocuments(),
      Contact.countDocuments()
    ]);

    // Calculate total books pledged from donations
    const bookAggregation = await Donation.aggregate([
      { $group: { _id: null, totalBooks: { $sum: "$numberOfBooks" } } }
    ]);
    const totalBooksPledged = bookAggregation.length > 0 ? bookAggregation[0].totalBooks : 0;

    res.status(200).json({
      success: true,
      counts: {
        totalBooksPledged,
        totalDonations,
        totalEssays,
        totalVolunteers,
        totalCollabs,
        totalEvents,
        totalContacts
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Failed to retrieve dashboard stats." });
  }
};

// 2. GET /api/admin/submissions (Fetch All Form Data for Tables & Export)
exports.getAllSubmissions = async (req, res) => {
  try {
    const [essays, donations, volunteers, collabs, events, contacts] = await Promise.all([
      Essay.find().sort({ createdAt: -1 }),
      Donation.find().sort({ createdAt: -1 }),
      Volunteer.find().sort({ createdAt: -1 }),
      Collaboration.find().sort({ createdAt: -1 }),
      Event.find().sort({ createdAt: -1 }),
      Contact.find().sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        essays,
        donations,
        volunteers,
        collaborations: collabs,
        events,
        contacts
      }
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to load submissions." });
  }
};

// 3. PATCH /api/admin/essays/:id/status (Review & Set Winner Status)
exports.updateEssayStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const essay = await Essay.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!essay) {
      return res.status(404).json({ error: "Essay submission not found." });
    }

    res.status(200).json({ success: true, essay });
  } catch (error) {
    res.status(500).json({ error: "Failed to update essay status." });
  }
};

// 4. GET /api/admin/analytics/trends (Time-Series Linear Regression)
exports.getAnalyticsTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const donationStats = await Donation.aggregate([
      { $match: { createdAt: {$gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalBooks: { $sum: "$numberOfBooks" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const essayStats = await Essay.aggregate([
      { $match: { createdAt: {$gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalParticipants: { $sum: 1 }         }       },       {$sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timeSeriesData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;

      const foundDonation = donationStats.find((item) => item._id.year === year && item._id.month === monthNum);
      const foundEssay = essayStats.find((item) => item._id.year === year && item._id.month === monthNum);

      timeSeriesData.push({
        month: `${monthNames[d.getMonth()]} ${year}`,
        label: monthNames[d.getMonth()],
        books: foundDonation ? foundDonation.totalBooks : 0,
        participation: foundEssay ? foundEssay.totalParticipants : 0
      });
    }

    const bookModel = calculateLinearRegression(timeSeriesData, "books");
    const participationModel = calculateLinearRegression(timeSeriesData, "participation");

    res.status(200).json({
      success: true,
      timeSeriesData,
      models: {
        books: bookModel,
        participation: participationModel
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to generate trend analytics." });
  }
};

// 5. CMS Endpoints: GET and PUT Page Content
exports.getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const doc = await SiteContent.findOne({ page });
    res.status(200).json({ success: true, data: doc ? doc.content : null });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch page content." });
  }
};

exports.updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing required 'content' object in request body." });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { page },
      { 
        content, 
        lastUpdatedBy: req.user ? req.user._id : null 
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("CMS Update Error Details:", error);
    return res.status(500).json({ 
      error: "Failed to update page content.", 
      details: error.message 
    });
  }
};

// 6. User Roles Management
exports.getTeamUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: "Failed to load team members." });
  }
};

exports.deleteTeamUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "You cannot delete your own active admin account." });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};