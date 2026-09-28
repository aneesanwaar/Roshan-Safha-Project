const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const multer = require('multer');

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
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// 1. Connect Database
connectDB();

// 2. Middleware
app.use(express.json()); // Critical: Must be above routes
app.use(cors());


// 3. Routes Configuration
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes); // Registered the new contact endpoint
app.use("/api/events", eventRoutes); // Registered the new event endpoint
app.use("/api/collaborations", collabRoutes); // Registered the new collaboration endpoint
app.use("/api/essays", essayRoutes); // Registered the new essay endpoint
// // Static Folder for Uploads 
// // This allows you to visit http://localhost:5000/uploads/essays/yourfile.pdf
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/books", bookRoutes);
app.use("/api/chat", chatRoutes);



// 4. Base Route
app.get("/", (req, res) => {
  res.send("Roshan Safha API Running");
});


// 5. Global Error Handler for Multer Limits
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size is too large. Max limit is 5MB." });
    }
  }
  // Handle other errors
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});


// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});