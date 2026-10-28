const express = require('express');
const router = express.Router();
const controller = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../config/cloudinary');

router.get('/', controller.getAnnouncements);
router.get('/admin', protect, controller.getAdminAnnouncements);
router.get('/:slug', controller.getAnnouncement);
router.post('/', protect, uploadImage.single('featuredImage'), controller.createAnnouncement);
router.patch('/:id', protect, uploadImage.single('featuredImage'), controller.updateAnnouncement);
router.put('/:id', protect, uploadImage.single('featuredImage'), controller.updateAnnouncement);
router.delete('/:id', protect, controller.deleteAnnouncement);
module.exports = router;
