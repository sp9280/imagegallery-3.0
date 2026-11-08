const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

const browseController = require('../controllers/media/browseController');
const uploadController = require('../controllers/media/uploadController');
const publicController = require('../controllers/media/publicController');
const statsController = require('../controllers/media/statsController');
const adminController = require('../controllers/media/adminController');
const interactionController = require('../controllers/media/interactionController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Public routes (no authentication required)
router.get('/public', publicController.getPublicMedia);
router.get('/list', publicController.getPublicMedia); // Alias for /public
router.get('/public/:id', publicController.getMediaById);
router.get('/categories/:category', publicController.getMediaByCategory);
router.get('/category/:category', publicController.getMediaByCategory); // Alias for frontend
router.get('/categories', browseController.getCategories);

// Public interaction routes (no auth required for like checking and comments)
router.post('/interaction/:mediaId/like', interactionController.toggleLike);
router.get('/interaction/:mediaId/like-status', interactionController.checkLikeStatus);
router.post('/:mediaId/like', interactionController.toggleLike); // Route alias
router.get('/:mediaId/like-status', interactionController.checkLikeStatus); // Route alias
router.post('/interaction/:mediaId/comments', interactionController.addComment);
router.get('/interaction/:mediaId/comments', interactionController.getComments);
router.get('/media-status/:mediaId', interactionController.getMediaWithStatus);
router.post('/interaction/:mediaId/download', interactionController.trackDownload);

// Authenticated routes
router.use(protect); // All routes below require authentication

router.get('/browse', browseController.browseMedia);
router.get('/user', browseController.getUserMedia); // Get current user's media
router.post('/upload', upload.single('file'), uploadController.uploadMedia);
router.delete('/:id', uploadController.deleteMedia);
router.get('/stats/user', statsController.getUserStats);

// Media interaction routes (authenticated)
router.put('/:mediaId/hide', interactionController.toggleHide);
router.get('/:mediaId/hide-history', interactionController.getHideHistory);
router.put('/:mediaId/edit', interactionController.editMedia);
router.delete('/:mediaId/comments/:commentId', interactionController.deleteComment);
router.post('/:mediaId/request-unlock', interactionController.requestUnlock);
router.post('/:mediaId/resolve-unlock', interactionController.resolveUnlock);

// Bulk operations (admin/coadmin only - checked in controller)
router.post('/bulk/hide', interactionController.bulkHide);

// Admin routes
router.use(role('admin')); // Admin only routes

router.get('/admin/all', adminController.getAllMedia);
router.post('/admin/manage', adminController.manageMedia);
router.get('/admin/dashboard', adminController.getAdminDashboard);

module.exports = router;
