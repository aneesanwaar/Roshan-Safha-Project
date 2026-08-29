const express = require("express");
const router = express.Router();
const {
  getBooks,
  addBook,
  updateBook,
  claimBook
} = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getBooks);
router.post("/:id/claim", claimBook);

// Admin protected routes
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);

module.exports = router;