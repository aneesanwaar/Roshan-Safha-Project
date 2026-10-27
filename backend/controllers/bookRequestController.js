const mongoose = require("mongoose");
const Book = require("../models/Book");
const BookRequest = require("../models/BookRequest");

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

const VALID_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Fulfilled",
];

const VALID_COLLECTION_PREFERENCES = [
  "Collection",
  "Delivery",
];

const isValidId = (id) => mongoose.isValidObjectId(id);

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);

  const limit = Math.min(
    100,
    Math.max(1, parseInt(query.limit, 10) || 10)
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

// -------------------------------------------------------------
// Custom Error for Transaction Validation
// -------------------------------------------------------------

class RequestOperationError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.name = "RequestOperationError";
    this.statusCode = statusCode;
  }
}

// -------------------------------------------------------------
// 1. PUBLIC — Submit a Book Request
// POST /api/book-requests
// -------------------------------------------------------------

exports.createBookRequest = async (req, res) => {
  try {
    const {
      bookId,
      studentName,
      phone,
      institution,
      quantity,
      reason,
      collectionPreference,
    } = req.body;

    // Validate required fields
    if (
      !bookId ||
      !studentName?.trim() ||
      !phone?.trim() ||
      !institution?.trim()
    ) {
      return sendError(
        res,
        400,
        "Book, student name, contact number, and institution are required."
      );
    }

    if (!isValidId(bookId)) {
      return sendError(res, 400, "Invalid book ID.");
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isSafeInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return sendError(
        res,
        400,
        "Requested quantity must be a positive whole number."
      );
    }

    if (
      collectionPreference &&
      !VALID_COLLECTION_PREFERENCES.includes(
        collectionPreference
      )
    ) {
      return sendError(
        res,
        400,
        "Invalid collection preference."
      );
    }

    // Confirm book exists and is currently available
    const book = await Book.findById(bookId);

    if (!book) {
      return sendError(
        res,
        404,
        "The selected book was not found."
      );
    }

    if (
      !book.isAvailable ||
      book.availableQuantity < requestedQuantity
    ) {
      return sendError(
        res,
        409,
        `Only ${book.availableQuantity} ${book.availableQuantity === 1
          ? "copy is"
          : "copies are"
        } currently available.`
      );
    }

    // Only allow public fields to be submitted.
    // Status and admin notes cannot be set by the requester.
    const bookRequest = await BookRequest.create({
      book: book._id,
      studentName: studentName.trim(),
      phone: phone.trim(),
      institution: institution.trim(),
      quantity: requestedQuantity,
      reason:
        typeof reason === "string"
          ? reason.trim()
          : "",
      collectionPreference:
        collectionPreference || "Collection",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Your book request has been submitted successfully.",
      data: {
        _id: bookRequest._id,
        book: {
          _id: book._id,
          title: book.title,
        },
        status: bookRequest.status,
        quantity: bookRequest.quantity,
        createdAt: bookRequest.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Create book request error:",
      error
    );

    if (error.name === "ValidationError") {
      return sendError(
        res,
        400,
        error.message
      );
    }

    return sendError(
      res,
      500,
      "Unable to submit your request. Please try again."
    );
  }
};

// -------------------------------------------------------------
// 2. ADMIN — Get All Book Requests
// GET /api/book-requests/admin
// -------------------------------------------------------------

exports.getAdminBookRequests = async (req, res) => {
  try {
    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const query = {};

    if (req.query.status) {
      if (
        !VALID_STATUSES.includes(
          req.query.status
        )
      ) {
        return sendError(
          res,
          400,
          "Invalid request status."
        );
      }

      query.status = req.query.status;
    }

    const [requests, total] = await Promise.all([
      BookRequest.find(query)
        .populate(
          "book",
          "title author subject educationLevel availableQuantity locationShelf"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      BookRequest.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: requests,
    });
  } catch (error) {
    console.error(
      "Get admin book requests error:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to load book requests."
    );
  }
};

// -------------------------------------------------------------
// 3. ADMIN — Get One Book Request
// GET /api/book-requests/admin/:id
// -------------------------------------------------------------

exports.getBookRequestById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return sendError(
        res,
        400,
        "Invalid request ID."
      );
    }

    const bookRequest = await BookRequest.findById(
      req.params.id
    )
      .populate("book")
      .lean();

    if (!bookRequest) {
      return sendError(
        res,
        404,
        "Book request not found."
      );
    }

    return res.status(200).json({
      success: true,
      data: bookRequest,
    });
  } catch (error) {
    console.error(
      "Get book request error:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to retrieve the book request."
    );
  }
};

// -------------------------------------------------------------
// 4. ADMIN — Update Request Status
// PATCH /api/book-requests/admin/:id/status
// -------------------------------------------------------------

exports.updateBookRequestStatus = async (req, res) => {
  const { status, adminNotes } = req.body;

  // -----------------------------------------------------------
  // Validate request
  // -----------------------------------------------------------

  if (!isValidId(req.params.id)) {
    return sendError(
      res,
      400,
      "Invalid request ID."
    );
  }

  if (!VALID_STATUSES.includes(status)) {
    return sendError(
      res,
      400,
      "Invalid request status."
    );
  }

  if (
    adminNotes !== undefined &&
    typeof adminNotes !== "string"
  ) {
    return sendError(
      res,
      400,
      "Admin notes must be text."
    );
  }

  // -----------------------------------------------------------
  // SECURE FULFILLMENT USING MONGODB TRANSACTIONS
  // -----------------------------------------------------------

  if (status === "Fulfilled") {
    const session = await mongoose.startSession();

    try {
      let fulfilledRequest = null;
      let updatedBook = null;

      await session.withTransaction(async () => {
        // Read the request within the transaction.
        const bookRequest =
          await BookRequest.findById(
            req.params.id
          ).session(session);

        if (!bookRequest) {
          throw new RequestOperationError(
            404,
            "Book request not found."
          );
        }

        if (
          bookRequest.status === "Fulfilled"
        ) {
          throw new RequestOperationError(
            409,
            "This request has already been fulfilled."
          );
        }

        if (
          bookRequest.status !== "Approved"
        ) {
          throw new RequestOperationError(
            400,
            "Approve the request before marking it as fulfilled."
          );
        }

        // Validate inventory before attempting deduction.
        const book = await Book.findById(
          bookRequest.book
        ).session(session);

        if (!book) {
          throw new RequestOperationError(
            404,
            "The requested book no longer exists."
          );
        }

        if (
          book.availableQuantity <
          bookRequest.quantity
        ) {
          throw new RequestOperationError(
            409,
            `Insufficient inventory. Only ${book.availableQuantity} copies are available.`
          );
        }

        // Deduct stock within the same transaction.
        // Conditional filter prevents negative inventory.
        // ---------------------------------------------------------
        // Deduct stock safely inside the MongoDB transaction
        // ---------------------------------------------------------

        updatedBook = await Book.findOneAndUpdate(
          {
            _id: bookRequest.book,
            availableQuantity: {
              $gte: bookRequest.quantity,
            },
          },
          [
            {
              $set: {
                availableQuantity: {
                  $subtract: [
                    "$availableQuantity",
                    bookRequest.quantity,
                  ],
                },
              },
            },
            {
              $set: {
                isAvailable: {
                  $gt: ["$availableQuantity", 0],
                },
              },
            },
          ],
          {
            returnDocument: "after",
            updatePipeline: true,
            session,
          }
        );

        if (!updatedBook) {
          throw new RequestOperationError(
            409,
            "Not enough copies are available to fulfill this request."
          );
        }

        // Update request status in the same transaction.
        bookRequest.status = "Fulfilled";
        bookRequest.fulfilledAt = new Date();

        if (adminNotes !== undefined) {
          bookRequest.adminNotes =
            adminNotes.trim();
        }

        await bookRequest.save({
          session,
        });

        fulfilledRequest = bookRequest;
      });

      // Both updates have committed successfully.
      return res.status(200).json({
        success: true,
        message:
          "Book request fulfilled and inventory updated successfully.",
        data: fulfilledRequest,
        inventory: {
          bookId: updatedBook._id,
          availableQuantity:
            updatedBook.availableQuantity,
          isAvailable:
            updatedBook.isAvailable,
        },
      });
    } catch (error) {
      console.error(
        "Secure fulfillment error:",
        error
      );

      if (
        error instanceof RequestOperationError
      ) {
        return sendError(
          res,
          error.statusCode,
          error.message
        );
      }

      if (
        error.name === "ValidationError"
      ) {
        return sendError(
          res,
          400,
          error.message
        );
      }

      // Concurrent modifications may cause transaction
      // conflicts. MongoDB can retry transient errors,
      // but we still return a safe response if retries fail.
      if (
        error.hasErrorLabel?.(
          "TransientTransactionError"
        ) ||
        error.code === 112
      ) {
        return sendError(
          res,
          409,
          "This request or its inventory was modified by another operation. Please refresh and try again."
        );
      }

      return sendError(
        res,
        500,
        "Unable to fulfill the request. Inventory changes were rolled back."
      );
    } finally {
      await session.endSession();
    }
  }

  // -----------------------------------------------------------
  // OTHER STATUS UPDATES
  // Pending / Approved / Rejected
  // -----------------------------------------------------------

  try {
    const update = {
      $set: {
        status,
      },
    };

    if (adminNotes !== undefined) {
      update.$set.adminNotes =
        adminNotes.trim();
    }

    // The status condition prevents modification
    // of already-fulfilled requests.
    const bookRequest =
      await BookRequest.findOneAndUpdate(
        {
          _id: req.params.id,
          status: {
            $ne: "Fulfilled",
          },
        },
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!bookRequest) {
      const existing =
        await BookRequest.findById(
          req.params.id
        );

      if (!existing) {
        return sendError(
          res,
          404,
          "Book request not found."
        );
      }

      return sendError(
        res,
        409,
        "This request has already been fulfilled and cannot be modified."
      );
    }

    return res.status(200).json({
      success: true,
      message:
        `Book request marked as ${status}.`,
      data: bookRequest,
    });
  } catch (error) {
    console.error(
      "Update book request status error:",
      error
    );

    if (
      error.name === "ValidationError"
    ) {
      return sendError(
        res,
        400,
        error.message
      );
    }

    return sendError(
      res,
      500,
      "Unable to update the book request."
    );
  }
};

// -------------------------------------------------------------
// 5. ADMIN — Delete Book Request
// DELETE /api/book-requests/admin/:id
// -------------------------------------------------------------

exports.deleteBookRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return sendError(
        res,
        400,
        "Invalid request ID."
      );
    }

    // Atomic conditional deletion ensures that
    // fulfilled requests remain preserved.
    const deletedRequest =
      await BookRequest.findOneAndDelete({
        _id: req.params.id,
        status: {
          $ne: "Fulfilled",
        },
      });

    if (!deletedRequest) {
      const existing =
        await BookRequest.findById(
          req.params.id
        );

      if (!existing) {
        return sendError(
          res,
          404,
          "Book request not found."
        );
      }

      return sendError(
        res,
        409,
        "Fulfilled requests cannot be deleted because they are part of the distribution history."
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Book request deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete book request error:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to delete the book request."
    );
  }
};