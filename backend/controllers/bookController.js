const Book = require("../models/Book");

// 1. GET /api/books (Public: Search, Filter, and Pagination)
exports.getBooks = async (req, res) => {
  try {
    const { search, educationLevel, subject, condition, page = 1, limit = 12 } = req.query;

    const query = { isAvailable: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } }
      ];
    }

    if (educationLevel && educationLevel !== "All") {
      query.educationLevel = educationLevel;
    }

    if (subject && subject !== "All") {
      query.subject = { $regex: subject, $options: "i" };
    }

    if (condition && condition !== "All") {
      query.condition = condition;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [books, total] = await Promise.all([
      Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Book.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: books
    });
  } catch (error) {
    console.error("Get Books Error:", error);
    res.status(500).json({ error: "Failed to fetch book catalog." });
  }
};

// 2. GET /api/books/:id (Public: Single Book Details)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book details." });
  }
};

// 3. POST /api/books (Admin: Add New Restored Book to Shelf)
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error("Create Book Error:", error);
    res.status(400).json({ error: error.message || "Failed to create book entry." });
  }
};

// 4. PUT /api/books/:id (Admin: Update Book Details / Adjust Stock)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Auto-update availability flag
    book.isAvailable = book.availableQuantity > 0;
    await book.save();

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update book." });
  }
};

// 5. DELETE /api/books/:id (Admin: Remove Book from Inventory)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }
    res.status(200).json({ success: true, message: "Book removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
};