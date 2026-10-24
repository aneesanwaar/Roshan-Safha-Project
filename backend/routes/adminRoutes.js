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
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const { uploadImage } = require("../config/cloudinary");

// ==========================================
// PUBLIC READ-ONLY ROUTES (SITE VISITORS)
// ==========================================

router.get("/cms/:page", getPageContent);

router.get("/menu", getMenuItems);

router.get("/winners", getWinners);

// ==========================================
// ALL SUBSEQUENT ROUTES REQUIRE A VALID JWT
// ==========================================

router.use(protect);

// ==========================================
// 1. OVERVIEW & SUBMISSIONS
// ==========================================

router.get("/stats", getDashboardStats);

router.get("/submissions", getSubmissions);

router.patch(
  "/submissions/:type/:id/status",
  updateSubmissionStatus
);

router.get("/submissions/export", exportSubmissions);

// ==========================================
// 2. ANALYTICS
// ==========================================

router.get("/analytics/trends", getAnalyticsTrends);

// ==========================================
// 3. CMS MANAGEMENT
// ==========================================

router.put("/cms/:page", updatePageContent);

/**
 * POST /api/admin/cms/upload-image
 *
 * Authentication:
 *   Required (via router.use(protect))
 *
 * Request:
 *   multipart/form-data
 *   image: <JPG/JPEG/PNG file>
 *
 * Response:
 *   {
 *     success: true,
 *     message: "...",
 *     data: {
 *       url: "...",
 *       publicId: "..."
 *     }
 *   }
 */
router.post(
  "/cms/upload-image",
  (req, res, next) => {
    uploadImage.single("image")(req, res, (error) => {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            error: "Image must not exceed 5 MB.",
          });
        }

        return res.status(400).json({
          success: false,
          error: "Image upload failed or file type is unsupported.",
        });
      }

      return next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "An image file is required.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "CMS image uploaded successfully.",
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  }
);

// ==========================================
// 4. WINNERS ARCHIVE
// ==========================================

router.post("/winners", createWinner);

router.delete("/winners/:id", deleteWinner);

// ==========================================
// 5. MENU MANAGEMENT
// ==========================================

router.put("/menu/:id", updateMenuItem);

// ==========================================
// 6. TEAM MANAGEMENT (READ-ONLY)
// ==========================================

// Team account creation, deletion, and role changes
// are disabled until proper role-based access
// controls and account-protection rules are implemented.

router.get("/users", getTeamUsers);

// Explicitly reject account deletion requests.
router.delete("/users/:id", (req, res) => {
  return res.status(403).json({
    success: false,
    error: "Team account deletion is currently disabled.",
  });
});

module.exports = router;