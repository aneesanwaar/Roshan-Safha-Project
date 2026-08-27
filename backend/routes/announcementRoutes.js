const express = require("express");
const router = express.Router();
const { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement 
} = require("../controllers/announcementController");
const { protect } = require("../middleware/authMiddleware");
const { uploadImage } = require("../config/cloudinary"); // Your Cloudinary config

// PUBLIC: Anyone can read news
router.get("/", getAnnouncements);

// PRIVATE: Only Founder can manage news
// We add uploadImage.single("featuredImage") here. 
// "featuredImage" must match the Key name you use in Postman or your Frontend form.
router.post("/", protect, uploadImage.single("featuredImage"), createAnnouncement);

router.delete("/:id", protect, deleteAnnouncement);

module.exports = router;