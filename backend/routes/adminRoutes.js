const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getSubmissions,
  updateSubmissionStatus,
  exportSubmissions,
  getAnalyticsTrends,
  getPageContent,
  updatePageContent,
  getWinners,
  createWinner,
  deleteWinner,
  getMenuItems,
  updateMenuItem,
  getTeamUsers,
  deleteTeamUser
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// All admin routes protected by JWT
router.use(protect);

// 1. Overview & Submissions Operations
router.get("/stats", getDashboardStats);
router.get("/submissions", getSubmissions);
router.patch("/submissions/:type/:id/status", updateSubmissionStatus);
router.get("/submissions/export", exportSubmissions);

// 2. AI Decision-Support & Trends
router.get("/analytics/trends", getAnalyticsTrends);

// 3. Multi-Page CMS
router.get("/cms/:page", getPageContent);
router.put("/cms/:page", updatePageContent);

// 4. Past Winners Archive
router.get("/winners", getWinners);
router.post("/winners", createWinner);
router.delete("/winners/:id", deleteWinner);

// 5. Menu & Navigation Management
router.get("/menu", getMenuItems);
router.put("/menu/:id", updateMenuItem);

// 6. Team Roles & Access Control
router.get("/users", getTeamUsers);
router.delete("/users/:id", deleteTeamUser);

module.exports = router;