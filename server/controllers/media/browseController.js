// server/controllers/media/browseController.js
const Media = require('../../models/Media');
const response = require('../../utils/response');
const logger = require('../../config/logger');

/**
 * Browse media with filters and pagination
 */
const browseMedia = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = { isPublic: true, isHidden: false }; // Only show public, non-hidden media

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const media = await Media.find(query)
      .populate('user', '_id username')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(query);

    logger.info(`Browsed ${media.length} media items`);
    response.success(res, 'Media browsed successfully', {
      items: media, // Changed from 'media' to 'items' for consistency
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error('Error browsing media:', err);
    response.error(res, 'Failed to browse media', 500);
  }
};

/**
 * Get media categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Media.distinct('category');
    response.success(res, 'Categories retrieved', { categories });
  } catch (err) {
    logger.error('Error fetching categories:', err);
    response.error(res, 'Failed to fetch categories', 500);
  }
};

/**
 * Get current user's media (includes both public, private, and hidden media)
 * If user is admin, they have full access to view all media across all users
 */
const getUserMedia = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const isAdmin = req.user.role === 'admin';
    let query = {};

    if (isAdmin && req.query.scope === 'all') {
      // In general user view, an image that was set private by its uploader
      // should only be accessible to that user, not in the public feed or other users' profiles.
      // But admin can see uploaded pictures on their admin dashboard.
      // If fetching global scope in user media, filter out other users' private uploads:
      query = {
        $or: [
          { user: userId },
          { isPublic: true }
        ]
      };
    } else if (isAdmin && req.query.userId) {
      if (req.query.userId === userId) {
        query.user = userId;
      } else {
        // Viewing another specific user: only their public uploads
        query = { user: req.query.userId, isPublic: true };
      }
    } else {
      // Regular user: shows ALL their own uploaded works (both public and private)
      query.user = userId;
    }
    
    const media = await Media.find(query)
      .populate('user', '_id username email')
      .sort({ createdAt: -1 }); // Newest first

    logger.info(`Retrieved ${media.length} media items for user ${userId} (role: ${req.user.role})`);
    response.success(res, 'User media retrieved successfully', { items: media });
  } catch (err) {
    logger.error('Error fetching user media:', err);
    response.error(res, 'Failed to fetch user media', 500);
  }
};

module.exports = {
  browseMedia,
  getCategories,
  getUserMedia,
};
