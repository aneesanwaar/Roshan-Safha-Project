// middleware/upload.js
const multer = require('multer');
const path = require('path');

// 1. Define Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in backend/uploads/essays/
    cb(null, 'uploads/essays/');
  },
  filename: (req, file, cb) => {
    // Rename file: TIMESTAMP-ORIGINALNAME.pdf
    // This prevents overwriting if two people upload "essay.pdf"
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Define File Filter (Security)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed!'));
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter
});

module.exports = upload;