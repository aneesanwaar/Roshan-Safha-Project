const express = require("express");
const router = express.Router();

const {
  getBooks,
  getAdminInventory,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Public routes
router.get("/", getBooks);

// Admin inventory — includes available and out-of-stock books
// IMPORTANT: Must appear before "/:id"
router.get(
  "/admin/inventory",
  protect,
  authorizeRoles("admin", "Super Admin"),
  getAdminInventory
);

// Public single-book details
router.get("/:id", getBookById);

// Admin: Add a book
router.post(
  "/",
  protect,
  authorizeRoles("admin", "Super Admin"),
  createBook
);

// Admin: Update a book
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "Super Admin"),
  updateBook
);

// Admin: Delete a book
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "Super Admin"),
  deleteBook
);

module.exports = router;