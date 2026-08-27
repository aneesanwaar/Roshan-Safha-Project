const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// All routes in this file will eventually be related to the Admin Dashboard
router.get("/stats", protect, getDashboardStats);

module.exports = router;