
const express = require("express");
const router = express.Router();
const { uploadDoc } = require("../config/cloudinary");
const { 
  submitEssay, 
  getAllEssays, 
  updateEssayStatus
} = require("../controllers/essayController");
const verifyRecaptcha = require("../middleware/recaptcha");
const { protect } = require("../middleware/authMiddleware");

// [POST] Public: Anyone can submit an essay
router.post("/", uploadDoc.single("essayFile"), verifyRecaptcha, submitEssay);

// [GET] Protected: Only the Admin can see the list
// If getAllEssays is undefined, this line crashes the server!
router.get("/", protect, getAllEssays); 

// [PATCH] Protected: Update the status of a specific essay
router.patch("/:id/status", protect, updateEssayStatus);

module.exports = router;