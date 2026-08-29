const Book = require("../models/Book");

// @desc    Get all books with optional search and grade filter
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const { search, grade } = req.query;
    let query = { status: "Available" };

    if (grade && grade !== "All") {
      query.gradeLevel = grade;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } }
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a restored book into inventory
// @route   POST /api/books
// @access  Private (Admin)
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update book details / stock count
// @route   PUT /api/books/:id
// @access  Private (Admin)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Claim / Request a book copy
// @route   POST /api/books/:id/claim
// @access  Public
exports.claimBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || book.copiesAvailable < 1) {
      return res.status(400).json({ success: false, message: "Book copy no longer available" });
    }

    book.copiesAvailable -= 1;
    if (book.copiesAvailable === 0) {
      book.status = "Out of Stock";
    }
    await book.save();

    res.status(200).json({ success: true, message: "Book reserved successfully", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};