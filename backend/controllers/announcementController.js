const cloudinary = require('cloudinary').v2;
const Announcement = require("../models/Announcement");


// @desc    Create new announcement with Cloudinary Image
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  try {
    // 1. Spread existing text fields (title, content, category)
    const announcementData = { ...req.body };

    // 2. If a file was uploaded, Multer/Cloudinary puts the URL in req.file.path
    if (req.file) {
      announcementData.featuredImage = req.file.path;
    }

    // 3. Save to MongoDB
    const announcement = await Announcement.create(announcementData);
    
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all announcements (with optional category filter)
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    // Sort by date: latest first
    const announcements = await Announcement.find(query).sort({ date: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete announcement
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    if (announcement.featuredImage) {
      // PRO TIP: This regex or split logic ensures we only get the path starting from "RoshanSafha"
      // It handles version numbers (v12345...) automatically.
      const urlParts = announcement.featuredImage.split('/');
      const fileNameWithExtension = urlParts.pop(); // e.g., "my_image.jpg"
      const publicId = `RoshanSafha/Content/${fileNameWithExtension.split('.')[0]}`;
      
      console.log("Deleting from Cloudinary:", publicId);
      await cloudinary.uploader.destroy(publicId);
    }

    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement and cloud image deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};