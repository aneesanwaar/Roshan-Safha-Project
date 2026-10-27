const express = require("express");

const router = express.Router();

const {
  createBookRequest,
  getAdminBookRequests,
  getBookRequestById,
  updateBookRequestStatus,
  deleteBookRequest,
} = require("../controllers/bookRequestController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

// Submit a new book request
// POST /api/book-requests
router.post("/", createBookRequest);

// -------------------------------------------------------------
// ADMIN ROUTES
// -------------------------------------------------------------

// Get all book requests (with pagination and status filtering)
// GET /api/book-requests/admin
router.get(
  "/admin",
  protect,
  authorizeRoles("admin", "Super Admin"),
  getAdminBookRequests
);

// Get a specific book request
// GET /api/book-requests/admin/:id
router.get(
  "/admin/:id",
  protect,
  authorizeRoles("admin", "Super Admin"),
  getBookRequestById
);

// Approve, reject, or fulfill a request
// PATCH /api/book-requests/admin/:id/status
router.patch(
  "/admin/:id/status",
  protect,
  authorizeRoles("admin", "Super Admin"),
  updateBookRequestStatus
);

// Delete a request (except fulfilled requests)
// DELETE /api/book-requests/admin/:id
router.delete(
  "/admin/:id",
  protect,
  authorizeRoles("admin", "Super Admin"),
  deleteBookRequest
);

module.exports = router;