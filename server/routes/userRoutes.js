// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const response = require('../utils/response');
const logger = require('../config/logger');

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return response.error(res, 'User not found', 404);
    }

    response.success(res, 'Profile retrieved successfully', { user });
  } catch (error) {
    logger.error('Error getting profile:', error);
    response.error(res, 'Failed to get profile', 500);
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      phoneNumber,
      secondaryEmail,
      nickname,
      yearOfStudy,
      stream
    } = req.body;

    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return response.error(res, 'User not found', 404);
    }

    // Update fields if provided
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim() || null;
    if (secondaryEmail !== undefined) {
      const trimmedEmail = secondaryEmail.trim();
      // Basic email validation
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return response.error(res, 'Invalid secondary email format', 400);
      }
      user.secondaryEmail = trimmedEmail || null;
    }
    if (nickname !== undefined) user.nickname = nickname.trim() || null;
    if (yearOfStudy !== undefined) user.yearOfStudy = yearOfStudy || null;
    if (stream !== undefined) user.stream = stream.trim() || null;

    await user.save();

    logger.info(`Profile updated for user: ${userId}`);
    
    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    response.success(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    logger.error('Error updating profile:', error);
    response.error(res, 'Failed to update profile', 500);
  }
});

module.exports = router;