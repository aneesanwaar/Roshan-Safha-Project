const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path'); // Added: needed for extension parsing

// 1. Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Storage Engine for Announcements/Gallery (Images)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RoshanSafha/Content',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 1000, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  },
});

// 3. Setup Storage Engine for Essays (PDFs/Docs)
const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const studentName = req.body.studentName ? req.body.studentName.replace(/\s+/g, '_') : 'student';
    const category = req.body.category || 'general';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase(); // Extract .pdf, .docx, .doc

    return {
      folder: 'RoshanSafha/Essays',
      resource_type: 'raw',
      // Explicitly append the extension so Cloudinary retains and downloads the correct format
      public_id: `${category}_${studentName}_${timestamp}${ext}`,
    };
  },
});

// 4. Define common limits (5MB = 5 * 1024 * 1024 bytes)
const limits = { fileSize: 5 * 1024 * 1024 };

const uploadImage = multer({ storage: imageStorage });
const uploadDoc = multer({
  storage: docStorage,
  limits: limits,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, and .docx formats are allowed!'));
    }
  },
});

module.exports = { uploadImage, uploadDoc };