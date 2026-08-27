const Gallery = require("../models/Gallery");
const cloudinary = require('cloudinary').v2;

// @desc    Add a photo to the gallery
// @access  Private (Admin)
exports.addPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image file." });
    }

    const { title, category } = req.body;

    const photo = await Gallery.create({
      title,
      category,
      imageUrl: req.file.path // This is the Cloudinary URL
    });

    res.status(201).json({ message: "Photo added to gallery!", photo });
  } catch (error) {
    // Cleanup: If DB fails, delete the image from Cloudinary
    if (req.file && req.file.path) {
      const publicId = req.file.path.split('/').slice(-3).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all gallery photos
// @access  Public
exports.getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};