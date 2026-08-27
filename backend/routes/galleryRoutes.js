const express = require("express");
const router = express.Router();
const { uploadImage } = require("../config/cloudinary");
const { addPhoto, getGallery } = require("../controllers/galleryController");
const { protect } = require("../middleware/authMiddleware");

// Public View
router.get("/", getGallery);

// Admin Upload (Protected)
router.post("/", protect, uploadImage.single("image"), addPhoto);

module.exports = router;