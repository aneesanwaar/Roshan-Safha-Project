const express = require("express");
const router = express.Router();
const { uploadImage } = require("../config/cloudinary");
const { addPhoto, getGallery, deletePhoto } = require("../controllers/galleryController");
const { protect } = require("../middleware/authMiddleware");

// Public View
router.get("/", getGallery);

// Admin Upload & Delete (Protected)
router.post("/", protect, uploadImage.single("image"), addPhoto);
router.delete("/:id", protect, deletePhoto);

module.exports = router;