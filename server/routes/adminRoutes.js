const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');
const adminController = require('../controllers/media/adminController');
const User = require('../models/User');
const Media = require('../models/Media');
const response = require('../utils/response');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');

// All admin routes require authentication and admin role
router.use(protect);
router.use(role('admin'));

router.get('/dashboard', adminController.getAdminDashboard);
router.get('/media', adminController.getAllMedia);
router.post('/media/manage', adminController.manageMedia);

// User Management Routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    response.success(res, 'Users retrieved successfully', users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    response.error(res, 'Failed to fetch users', 500);
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role: userRole } = req.body;
    
    if (!username || !email || !password) {
      return response.error(res, 'Username, email, and password are required', 400);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return response.error(res, 'User with this email or username already exists', 400);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole || 'user',
      isActive: true,
      active: true
    });
    
    await newUser.save();
    logger.info(`Admin created new user: ${username}`);
    response.success(res, 'User created successfully', { user: { ...newUser.toObject(), password: undefined } });
  } catch (error) {
    logger.error('Error creating user:', error);
    response.error(res, 'Failed to create user', 500);
  }
});

router.patch('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { active, role: userRole } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return response.error(res, 'User not found', 404);
    }
    
    const targetActive = active !== undefined ? active : req.body.isActive;
    if (targetActive !== undefined) {
      user.active = targetActive;
      user.isActive = targetActive;
    }
    if (userRole !== undefined) user.role = userRole;
    
    await user.save();
    logger.info(`Admin updated user: ${userId}`);
    response.success(res, 'User updated successfully', { user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    logger.error('Error updating user:', error);
    response.error(res, 'Failed to update user', 500);
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Don't allow deleting yourself
    if (userId === req.user.id) {
      return response.error(res, 'Cannot delete your own account', 400);
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return response.error(res, 'User not found', 404);
    }
    
    // Delete user's media
    await Media.deleteMany({ user: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    logger.info(`Admin deleted user: ${userId}`);
    response.success(res, 'User and associated media deleted successfully');
  } catch (error) {
    logger.error('Error deleting user:', error);
    response.error(res, 'Failed to delete user', 500);
  }
});

// Comment Moderation
router.delete('/comments/:mediaId/:commentId', async (req, res) => {
  try {
    const { mediaId, commentId } = req.params;
    
    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }
    
    media.comments = media.comments.filter(c => c._id.toString() !== commentId);
    await media.save();
    
    logger.info(`Admin deleted comment: ${commentId} from media: ${mediaId}`);
    response.success(res, 'Comment deleted successfully');
  } catch (error) {
    logger.error('Error deleting comment:', error);
    response.error(res, 'Failed to delete comment', 500);
  }
});

module.exports = router;
