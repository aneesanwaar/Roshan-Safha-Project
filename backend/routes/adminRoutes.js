const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getSubmissions,
  updateSubmissionStatus,
  getAnalyticsTrends,
  getPageContent,
  updatePageContent,
  getWinners,
  createWinner,
  deleteWinner,
  getTeamUsers,
  deleteTeamUser
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// All admin routes require JWT verification
router.use(protect);

// 1. Dashboard Overview Stats & Submissions Data
router.get("/stats", getDashboardStats);
router.get("/submissions", getSubmissions);
router.patch("/submissions/:type/:id/status", updateSubmissionStatus);

// 2. AI Trend Analytics
router.get("/analytics/trends", getAnalyticsTrends);

// 3. Multi-Page CMS
router.get("/cms/:page", getPageContent);
router.put("/cms/:page", updatePageContent);

// 4. Past Winners Archive
router.get("/winners", getWinners);
router.post("/winners", createWinner);
router.delete("/winners/:id", deleteWinner);

// 5. Team Member Roles
router.get("/users", getTeamUsers);
router.delete("/users/:id", deleteTeamUser);

module.exports = router;