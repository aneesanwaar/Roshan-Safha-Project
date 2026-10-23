const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

/**
 * Roshan Safha Cloudinary Configuration
 *
 * Used for:
 * - Homepage CMS images
 * - Gallery photographs
 * - Announcement images
 * - Essay document submissions
 */

// ==========================================
// CLOUDINARY CONFIGURATION
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// FILE SIZE LIMITS
// ==========================================

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const DOCUMENT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// ==========================================
// ALLOWED FILE TYPES
// ==========================================

const allowedImageTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
]);

const allowedDocumentTypes = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [
    ".docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
]);

// ==========================================
// IMAGE STORAGE
// ==========================================

const imageStorage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "RoshanSafha/Content",

    resource_type: "image",

    allowed_formats: ["jpg", "jpeg", "png"],

    transformation: [
      {
        width: 1000,
        crop: "limit",
      },
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  }),
});

// ==========================================
// DOCUMENT STORAGE
// ==========================================

const docStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const extension = path.extname(file.originalname).toLowerCase();

    // Use a random identifier instead of personal information.
    const uniqueId = crypto.randomUUID();

    return {
      folder: "RoshanSafha/Essays",

      resource_type: "raw",

      public_id: `essay_${uniqueId}${extension}`,
    };
  },
});

// ==========================================
// IMAGE VALIDATION
// ==========================================

const imageFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const expectedMimeType = allowedImageTypes.get(extension);

  if (
    !expectedMimeType ||
    file.mimetype !== expectedMimeType
  ) {
    return cb(
      new Error("Only valid JPG, JPEG, and PNG images are allowed.")
    );
  }

  return cb(null, true);
};

// ==========================================
// DOCUMENT VALIDATION
// ==========================================

const documentFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const expectedMimeType = allowedDocumentTypes.get(extension);

  if (
    !expectedMimeType ||
    file.mimetype !== expectedMimeType
  ) {
    return cb(
      new Error("Only PDF, DOC, and DOCX documents are allowed.")
    );
  }

  return cb(null, true);
};

// ==========================================
// MULTER UPLOAD MIDDLEWARE
// ==========================================

const uploadImage = multer({
  storage: imageStorage,

  limits: {
    fileSize: IMAGE_MAX_SIZE,
    files: 1,
  },

  fileFilter: imageFileFilter,
});

const uploadDoc = multer({
  storage: docStorage,

  limits: {
    fileSize: DOCUMENT_MAX_SIZE,
    files: 1,
  },

  fileFilter: documentFileFilter,
});

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  uploadImage,
  uploadDoc,
};