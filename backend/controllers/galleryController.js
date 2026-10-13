const Gallery = require("../models/Gallery");
const cloudinary = require("cloudinary").v2;

// @desc    Add a photo to the gallery
// @route   POST /api/gallery
// @access  Private (Admin)
exports.addPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image file." });
    }

    const { title, caption, album, category = "Event" } = req.body;

    const publicId = req.file.filename || (req.file.path ? req.file.path.split("/").slice(-2).join("/").split(".")[0] : "");

    const photo = await Gallery.create({
      title: title || caption || "Roshan Safha Media",
      caption: caption || title || "",
      album: album || "Book Restoration Hub",
      category,
      imageUrl: req.file.path, // Secure Cloudinary URL
      publicId
    });

    res.status(201).json({ success: true, message: "Photo added to gallery!", photo });
  } catch (error) {
    // Cleanup if DB write fails
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.warn("Cloudinary cleanup failed:", err.message);
      }
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all gallery photos
// @route   GET /api/gallery
// @access  Public
exports.getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a photo from MongoDB & Cloudinary
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, error: "Photo not found." });
    }

    // Remove from Cloudinary if publicId exists
    if (photo.publicId) {
      try {
        await cloudinary.uploader.destroy(photo.publicId);
      } catch (err) {
        console.warn("Could not delete from Cloudinary:", err.message);
      }
    }

    await photo.deleteOne();
    res.status(200).json({ success: true, message: "Photo deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};