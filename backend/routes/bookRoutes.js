const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public endpoints (Used by student catalog page)
router.get("/", getBooks);
router.get("/:id", getBookById);

// Protected Admin endpoints (Inventory management)
router.post("/", protect, authorizeRoles("admin", "Super Admin"), createBook);
router.put("/:id", protect, authorizeRoles("admin", "Super Admin"), updateBook);
router.delete("/:id", protect, authorizeRoles("admin", "Super Admin"), deleteBook);

module.exports = router;