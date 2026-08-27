const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

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
    // ADD THESE THREE LINES:
    transformation: [
      { width: 1000, crop: "limit" }, // Resizes if larger than 1000px
      { quality: "auto" },            // Compresses to best visual quality/file size ratio
      { fetch_format: "auto" }        // Converts to modern formats like WebP for speed
    ]
  },
});

// 3. Setup Storage Engine for Essays (PDFs/Docs)
const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract data from the body to use in the filename
    const studentName = req.body.studentName ? req.body.studentName.replace(/\s+/g, '_') : 'student';
    const category = req.body.category || 'general';
    const timestamp = Date.now();

    return {
      folder: 'RoshanSafha/Essays',
      resource_type: 'raw', // required for non-image files
      allowed_formats: ['pdf', 'doc', 'docx'],
      // This creates a name like: Senior_Ali_Khan_171123456.pdf
      public_id: `${category}_${studentName}_${timestamp}`, 
    };
  },
});

// 4. Define common limits (5MB = 5 * 1024 * 1024 bytes)
const limits = { fileSize: 5 * 1024 * 1024 };

const uploadImage = multer({ storage: imageStorage });
const uploadDoc = multer({ 
  storage: docStorage,
  limits: limits,
  // This fileFilter ensures only PDF and Word documents are accepted for essays
  fileFilter: (req, file, cb) => { 
    if (
      file.mimetype === "application/pdf" || 
      file.mimetype === "application/msword" || 
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed!"), false);
    }
  }
});
module.exports = { uploadImage, uploadDoc };