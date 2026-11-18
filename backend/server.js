const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const multer = require("multer");
const { generalApiLimiter } = require("./middleware/rateLimiters");

// Import Routes
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const eventRoutes = require("./routes/eventRoutes");
const collabRoutes = require("./routes/collaborationRoutes");
const essayRoutes = require("./routes/essayRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const bookRoutes = require("./routes/bookRoutes");

// NEW: Book Request Routes
const bookRequestRoutes = require("./routes/bookRequestRoutes");

const chatRoutes = require("./routes/chatRoutes");

const app = express();

// 1. Connect Database
connectDB();

// 2. Middleware
app.use(express.json());
// Stage 1.6: explicitly allow only configured browser frontend origins.
// CORS is a browser access policy, not an API authentication mechanism.
const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(helmet({
  // The Express server serves JSON APIs, not frontend HTML.
  // Configure a CSP separately on the host serving React HTML.
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin(origin, callback) {
    // No Origin header (e.g. Postman or server-to-server) needs no CORS header.
    if (!origin) return callback(null, false);
    return callback(null, allowedOrigins.has(origin));
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

// Apply a broad per-IP safety limit to API traffic before route-specific limits.
// Keep trust proxy at Express default (false) until deployment proxy topology is verified.
app.use("/api", generalApiLimiter);

// 3. Routes Configuration
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/collaborations", collabRoutes);
app.use("/api/essays", essayRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/books", bookRoutes);

// NEW: Register Book Request API
app.use("/api/book-requests", bookRequestRoutes);

app.use("/api/chat", chatRoutes);

// 4. Base Route
app.get("/", (req, res) => {
  res.send("Roshan Safha API Running");
});

// 5. Global Error Handler for Multer Limits
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size is too large. Max limit is 5MB.",
      });
    }
  }

  // Handle other errors
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});