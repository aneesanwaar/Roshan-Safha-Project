const mongoose = require("mongoose");
const Book = require("../models/Book");

// Fields that admins are allowed to create or update
const ALLOWED_FIELDS = [
  "title",
  "author",
  "subject",
  "educationLevel",
  "board",
  "language",
  "condition",
  "availableQuantity",
  "locationShelf"
];

// Prevent unexpected fields from being written to MongoDB
const pickAllowedFields = (body = {}) => {
  const data = {};

  for (const field of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
};

// Safely parse pagination parameters
const getPagination = (query) => {
  const parsedPage = Number(query.page);
  const parsedLimit = Number(query.limit);

  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const limit =
    Number.isSafeInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 100)
      : 12;

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

// Escape special regex characters in search text
const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Shared search/filter logic
const buildBookQuery = (params, publicOnly = false) => {
  const { search, educationLevel, subject, condition } = params;

  const query = publicOnly
    ? { isAvailable: true, availableQuantity: { $gt: 0 } }
    : {};

  if (typeof search === "string" && search.trim()) {
    const safeSearch = escapeRegex(search.trim());

    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { author: { $regex: safeSearch, $options: "i" } },
      { subject: { $regex: safeSearch, $options: "i" } }
    ];
  }

  if (
    typeof educationLevel === "string" &&
    educationLevel !== "All" &&
    educationLevel.trim()
  ) {
    query.educationLevel = educationLevel;
  }

  if (
    typeof subject === "string" &&
    subject !== "All" &&
    subject.trim()
  ) {
    query.subject = {
      $regex: escapeRegex(subject.trim()),
      $options: "i"
    };
  }

  if (
    typeof condition === "string" &&
    condition !== "All" &&
    condition.trim()
  ) {
    query.condition = condition;
  }

  return query;
};

// Consistent paginated response
const sendBookList = async (req, res, query) => {
  const { page, limit, skip } = getPagination(req.query);

  const [books, total] = await Promise.all([
    Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Book.countDocuments(query)
  ]);

  return res.status(200).json({
    success: true,
    count: books.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: books
  });
};

// -------------------------------------------------------
// 1. GET /api/books
// PUBLIC: Available books only
// -------------------------------------------------------
exports.getBooks = async (req, res) => {
  try {
    const query = buildBookQuery(req.query, true);

    return await sendBookList(req, res, query);
  } catch (error) {
    console.error("Get Books Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch book catalog."
    });
  }
};

// -------------------------------------------------------
// 2. GET /api/books/admin/inventory
// ADMIN: All books, including out-of-stock books
// -------------------------------------------------------
exports.getAdminInventory = async (req, res) => {
  try {
    const query = buildBookQuery(req.query);

    // Optional availability filter for the admin dashboard
    if (req.query.availability === "available") {
      query.availableQuantity = { $gt: 0 };
    } else if (req.query.availability === "out-of-stock") {
      query.availableQuantity = 0;
    }

    return await sendBookList(req, res, query);
  } catch (error) {
    console.error("Get Admin Inventory Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch book inventory."
    });
  }
};

// -------------------------------------------------------
// 3. GET /api/books/:id
// PUBLIC: Individual book details
// -------------------------------------------------------
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid book ID."
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error("Get Book By ID Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch book details."
    });
  }
};

// -------------------------------------------------------
// 4. POST /api/books
// ADMIN: Add a new book
// -------------------------------------------------------
exports.createBook = async (req, res) => {
  try {
    const bookData = pickAllowedFields(req.body);

    const book = await Book.create(bookData);

    return res.status(201).json({
      success: true,
      message: "Book added successfully.",
      data: book
    });
  } catch (error) {
    console.error("Create Book Error:", error);

    return res.status(400).json({
      success: false,
      error: error.message || "Failed to create book entry."
    });
  }
};

// -------------------------------------------------------
// 5. PUT /api/books/:id
// ADMIN: Edit book details or adjust stock
// -------------------------------------------------------
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid book ID."
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found."
      });
    }

    const updates = pickAllowedFields(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid fields provided for update."
      });
    }

    // Apply permitted changes to the existing document
    Object.assign(book, updates);

    // Triggers schema validation and pre("save") hook
    // which synchronizes isAvailable with availableQuantity
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      data: book
    });
  } catch (error) {
    console.error("Update Book Error:", error);

    return res.status(400).json({
      success: false,
      error: error.message || "Failed to update book."
    });
  }
};

// -------------------------------------------------------
// 6. DELETE /api/books/:id
// ADMIN: Remove a book from inventory
// -------------------------------------------------------
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid book ID."
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book removed successfully."
    });
  } catch (error) {
    console.error("Delete Book Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to delete book."
    });
  }
};