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
 * Get current user's media (includes hidden media for owner)
 */
const getUserMedia = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    
    const media = await Media.find({ user: userId })
      .populate('user', '_id username email')
      .sort({ createdAt: -1 }); // Newest first

    logger.info(`Retrieved ${media.length} media items for user ${userId}`);
    response.success(res, 'User media retrieved successfully', { items: media }); // Wrapped in items
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
