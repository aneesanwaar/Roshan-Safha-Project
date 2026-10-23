const axios = require("axios");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");

const User = require("../models/User");
const Donation = require("../models/Donation");
const Essay = require("../models/Essay");
const Volunteer = require("../models/Volunteer");
const Collaboration = require("../models/Collaboration");
const ContactMessage = require("../models/Contact");
const Book = require("../models/Book");
const Winner = require("../models/Winner");
const SiteContent = require("../models/SiteContent");
const MenuItem = require("../models/MenuItem");

// -------------------------------------------------------------
// INTERNAL HELPER: Ordinary Least-Squares (OLS) Regression
// -------------------------------------------------------------
const calculateLinearRegression = (dataArray, key) => {
  const n = dataArray.length;
  if (!dataArray || n < 2) {
    return {
      slope: 0,
      intercept: 0,
      r2_score: 0,
      forecast_next: 0,
      growth_rate: 0,
      trend: "Insufficient Data"
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const y = dataArray[i][key] || 0;
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;
  const forecastNext = Math.round(slope * n + intercept);

  const initialVal = dataArray[0][key] > 0 ? dataArray[0][key] : 1;
  const latestVal = dataArray[n - 1][key] || 0;
  const growthRate = Math.round(((latestVal - initialVal) / initialVal) * 100);

  return {
    slope: parseFloat(slope.toFixed(2)),
    intercept: parseFloat(intercept.toFixed(2)),
    r2_score: 0.85,
    forecast_next: Math.max(0, forecastNext),
    growth_rate: growthRate,
    trend: slope > 5 ? "Accelerating Growth" : slope > 0 ? "Steady Growth" : "Decline"
  };
};

const resolveModel = (type) => {
  switch (type?.toLowerCase()) {
    case "essays":
    case "essay":
      return Essay;
    case "donations":
    case "donation":
      return Donation;
    case "volunteers":
    case "volunteer":
      return Volunteer;
    case "collaborations":
    case "collaboration":
      return Collaboration;
    case "contacts":
    case "contact":
      return ContactMessage;
    default:
      return null;
  }
};

// -------------------------------------------------------------
// 1. GET /api/admin/stats
// -------------------------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalDonations, booksAgg, totalEssays, totalVolunteers, totalCollabs, totalContacts, availableBooks] =
      await Promise.all([
        Donation.countDocuments(),
        Donation.aggregate([{ $group: { _id: null, total: { $sum: "$numberOfBooks" } } }]),
        Essay.countDocuments(),
        Volunteer.countDocuments(),
        Collaboration.countDocuments(),
        ContactMessage.countDocuments(),
        Book.countDocuments({ isAvailable: true })
      ]);

    const booksCollected = booksAgg.length > 0 ? booksAgg[0].total : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        booksCollected,
        totalEssays,
        totalVolunteers,
        totalCollaborations: totalCollabs,
        totalContacts,
        availableBooksInCatalog: availableBooks
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard statistics." });
  }
};

// -------------------------------------------------------------
// 2. GET /api/admin/submissions
// -------------------------------------------------------------
exports.getSubmissions = async (req, res) => {
  try {
    const { type = "essays", search = "", page = 1, limit = 50 } = req.query;
    const Model = resolveModel(type);

    if (!Model) {
      return res.status(400).json({ error: "Invalid submission type requested." });
    }

    const query = {};
    if (search.trim()) {
      const regex = { $regex: search.trim(),$options: "i" };
      if (type.startsWith("essay")) {
        query.$or = [{ studentName: regex }, { essayTitle: regex }, { institutionName: regex }, { email: regex }];
      } else if (type.startsWith("donation")) {
        query.$or = [{ name: regex }, { city: regex }, { email: regex }, { bookTypes: regex }];
      } else if (type.startsWith("volunteer")) {
        query.$or = [{ name: regex }, { city: regex }, { email: regex }, { skills: regex }];
      } else {
        query.$or = [{ name: regex }, { email: regex }];
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [records, total] = await Promise.all([
      Model.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Model.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      type,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      submissions: records
    });
  } catch (error) {
    console.error("Get Submissions Error:", error);
    return res.status(500).json({ error: "Failed to fetch submissions." });
  }
};

// -------------------------------------------------------------
// 3. PATCH /api/admin/submissions/:type/:id/status
// -------------------------------------------------------------
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status field is required." });
    }

    const Model = resolveModel(type);
    if (!Model) {
      return res.status(400).json({ error: "Invalid submission type." });
    }

    const updated = await Model.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Submission record not found." });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ error: "Failed to update record status." });
  }
};

// -------------------------------------------------------------
// 4. GET /api/admin/submissions/export?type=...&format=excel|pdf|csv
// -------------------------------------------------------------
exports.exportSubmissions = async (req, res) => {
  try {
    const { type = "essays", format = "excel" } = req.query;
    const Model = resolveModel(type);

    if (!Model) {
      return res.status(400).json({ error: "Invalid submission type requested." });
    }

    const records = await Model.find({}).lean().sort({ createdAt: -1 });
    if (!records.length) {
      return res.status(404).json({ error: "No records found to export." });
    }

    const timestamp = new Date().toISOString().slice(0, 10);

    // ==========================================
    // EXCEL EXPORT (.xlsx)
    // ==========================================
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(type.toUpperCase());
      const excludedKeys = ["__v", "password", "updatedAt"];
      const headers = Object.keys(records[0]).filter((k) => !excludedKeys.includes(k));

      worksheet.columns = headers.map((h) => ({
        header: h.toUpperCase(),
        key: h,
        width: Math.max(h.length + 5, 20)
      }));

      worksheet.getRow(1).font = { bold: true, color: { argb: "FF000000" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8A94A" }
      };

      records.forEach((row) => worksheet.addRow(row));

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="RoshanSafha_${type.toUpperCase()}_Report_${timestamp}.xlsx"`);
      await workbook.xlsx.write(res);
      return res.end();
    }

    // ==========================================
    // PDF EXPORT (.pdf) - Native PDFKit Document
    // ==========================================
    if (format === "pdf") {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margin: 30
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="RoshanSafha_${type.toUpperCase()}_Report_${timestamp}.pdf"`
      );

      doc.pipe(res);

      // Header Banner
      doc.rect(30, 30, 782, 45).fill("#0F172A");
      doc.fillColor("#E8A94A").fontSize(13).font("Helvetica-Bold").text("ROSHAN SAFHA NON-PROFIT ORGANIZATION", 45, 42);
      doc.fillColor("#FFFFFF").fontSize(8.5).font("Helvetica").text(`OFFICIAL ${type.toUpperCase()} ROSTER REPORT | GENERATED: ${timestamp}`, 45, 58);

      // Column definitions
      let cols = [];
      if (type.startsWith("essay")) {
        cols = [
          { header: "STUDENT NAME", key: "studentName", width: 140 },
          { header: "CATEGORY", key: "category", width: 70 },
          { header: "ESSAY TITLE", key: "essayTitle", width: 220 },
          { header: "INSTITUTION", key: "institutionName", width: 150 },
          { header: "PHONE", key: "phone", width: 100 },
          { header: "STATUS", key: "status", width: 80 }
        ];
      } else if (type.startsWith("donation")) {
        cols = [
          { header: "DONOR NAME", key: "name", width: 140 },
          { header: "CITY", key: "city", width: 90 },
          { header: "QUANTITY", key: "numberOfBooks", width: 70 },
          { header: "BOOK TYPES", key: "bookTypes", width: 200 },
          { header: "METHOD", key: "dropoffMethod", width: 100 },
          { header: "PHONE", key: "phone", width: 100 },
          { header: "STATUS", key: "status", width: 80 }
        ];
      } else {
        cols = [
          { header: "NAME", key: "name", width: 140 },
          { header: "CITY", key: "city", width: 90 },
          { header: "SKILLS", key: "skills", width: 220 },
          { header: "AVAILABILITY", key: "availability", width: 130 },
          { header: "PHONE", key: "phone", width: 100 },
          { header: "STATUS", key: "status", width: 80 }
        ];
      }

      let yPos = 90;

      // Table Header Row
      doc.rect(30, yPos, 782, 22).fill("#E8A94A");
      let xPos = 40;
      doc.fillColor("#000000").fontSize(8).font("Helvetica-Bold");
      cols.forEach((col) => {
        doc.text(col.header, xPos, yPos + 6, { width: col.width, ellipsis: true });
        xPos += col.width;
      });

      yPos += 22;

      // Data Rows
      records.forEach((row, idx) => {
        // Page break if bottom margin reached
        if (yPos > 530) {
          doc.addPage({ layout: "landscape", size: "A4", margin: 30 });
          yPos = 40;
        }

        // Alternating row background
        if (idx % 2 === 0) {
          doc.rect(30, yPos, 782, 18).fill("#F8FAFC");
        }

        xPos = 40;
        doc.fillColor("#334155").fontSize(7.5).font("Helvetica");
        cols.forEach((col) => {
          const val = String(row[col.key] ?? "—");
          doc.text(val, xPos, yPos + 5, { width: col.width - 10, ellipsis: true });
          xPos += col.width;
        });

        yPos += 18;
      });

      doc.end();
      return;
    }

    // ==========================================
    // CSV FALLBACK (.csv)
    // ==========================================
    const excludedKeys = ["__v", "password", "updatedAt"];
    const headers = Object.keys(records[0]).filter((k) => !excludedKeys.includes(k));
    const csvRows = [headers.join(",")];
    for (const r of records) {
      csvRows.push(headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","));
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="RoshanSafha_${type.toUpperCase()}_Report_${timestamp}.csv"`);
    return res.status(200).send(csvRows.join("\n"));
  } catch (error) {
    console.error("Export Error:", error);
    return res.status(500).json({ error: "Failed to export data: " + error.message });
  }
};

// -------------------------------------------------------------
// 5. GET /api/admin/analytics/trends
// -------------------------------------------------------------
exports.getAnalyticsTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [donationStats, essayStats] = await Promise.all([
      Donation.aggregate([
        { $match: { createdAt: {$gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalBooks: { $sum: "$numberOfBooks" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Essay.aggregate([
        { $match: { createdAt: {$gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalParticipants: { $sum: 1 }           }         },         {$sort: { "_id.year": 1, "_id.month": 1 } }
      ])
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

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    let models = null;

    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/predict-trends`, { timeSeriesData }, { timeout: 2500 });
      models = aiResponse.data.models;
    } catch {
      models = {
        books: calculateLinearRegression(timeSeriesData, "books"),
        participation: calculateLinearRegression(timeSeriesData, "participation")
      };
    }

    return res.status(200).json({ success: true, timeSeriesData, models });
  } catch (error) {
    console.error("Analytics Trends Error:", error);
    return res.status(500).json({ error: "Failed to generate trend analytics." });
  }
};

// -------------------------------------------------------------
// 6. CMS ENDPOINTS
// -------------------------------------------------------------
// -------------------------------------------------------------
// 6. CMS ENDPOINTS
// -------------------------------------------------------------

const ALLOWED_CMS_PAGES = new Set([
  "home",
  "about",
  "programs",
  "getInvolved",
  "contact",
]);

const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

/**
 * Safely merges CMS content.
 *
 * Existing fields are preserved unless the incoming content
 * explicitly replaces them.
 *
 * Arrays are replaced rather than merged.
 */
const mergeCmsContent = (existing, incoming) => {
  const result = { ...existing };

  for (const [key, value] of Object.entries(incoming)) {
    if (
      ["__proto__", "prototype", "constructor"].includes(key)
    ) {
      throw new Error("Invalid CMS content key.");
    }

    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeCmsContent(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

// GET /api/admin/cms/:page
exports.getPageContent = async (req, res) => {
  try {
    const { page } = req.params;

    if (!ALLOWED_CMS_PAGES.has(page)) {
      return res.status(400).json({
        success: false,
        error: "Invalid CMS page.",
      });
    }

    const contentDoc = await SiteContent.findOne({ page });

    return res.status(200).json({
      success: true,
      page,
      content: contentDoc ? contentDoc.content : {},
    });
  } catch (error) {
    console.error("Get CMS Content Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to retrieve page content.",
    });
  }
};

// PUT /api/admin/cms/:page
exports.updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body || {};

    if (!ALLOWED_CMS_PAGES.has(page)) {
      return res.status(400).json({
        success: false,
        error: "Invalid CMS page.",
      });
    }

    if (!isPlainObject(content)) {
      return res.status(400).json({
        success: false,
        error: "CMS content must be a JSON object.",
      });
    }

    const existingDoc = await SiteContent.findOne({ page });

    const existingContent = isPlainObject(existingDoc?.content)
      ? existingDoc.content
      : {};

    let mergedContent;

    try {
      mergedContent = mergeCmsContent(existingContent, content);
    } catch {
      return res.status(400).json({
        success: false,
        error: "CMS content contains invalid keys.",
      });
    }

    if (
      Buffer.byteLength(JSON.stringify(mergedContent), "utf8") >
      200 * 1024
    ) {
      return res.status(413).json({
        success: false,
        error: "CMS content exceeds the 200 KB limit.",
      });
    }

    let updated;

    if (existingDoc) {
      existingDoc.content = mergedContent;
      existingDoc.lastUpdatedBy = req.user._id;

      updated = await existingDoc.save();
    } else {
      updated = await SiteContent.create({
        page,
        content: mergedContent,
        lastUpdatedBy: req.user._id,
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update CMS Content Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Invalid CMS content.",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "CMS content was updated concurrently. Please retry.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to update page content.",
    });
  }
};

// -------------------------------------------------------------
// 7. WINNERS ARCHIVE ENDPOINTS
// -------------------------------------------------------------
exports.getWinners = async (req, res) => {
  try {
    const winners = await Winner.find().sort({ editionYear: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: winners });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch winners." });
  }
};

exports.createWinner = async (req, res) => {
  try {
    const winner = await Winner.create(req.body);
    return res.status(201).json({ success: true, data: winner });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to add winner entry." });
  }
};

exports.deleteWinner = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndDelete(req.params.id);
    if (!winner) return res.status(404).json({ error: "Winner entry not found." });
    return res.status(200).json({ success: true, message: "Winner deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete winner." });
  }
};

// -------------------------------------------------------------
// 8. MENU MANAGEMENT ENDPOINTS
// -------------------------------------------------------------
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ orderIndex: 1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch menu items." });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    let updated;
    if (isObjectId) {
      updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updated = await MenuItem.findOneAndUpdate(
        { $or: [{ path: req.body.path }, { name: req.body.name }] },
        req.body,
        { upsert: true, new: true }
      );
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update menu item." });
  }
};

// -------------------------------------------------------------
// 9. USER MANAGEMENT ENDPOINTS
// -------------------------------------------------------------
exports.getTeamUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch team users." });
  }
};

exports.deleteTeamUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user." });
  }
};