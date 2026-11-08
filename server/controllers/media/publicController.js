// server/controllers/media/publicController.js
const Media = require('../../models/Media');
const response = require('../../utils/response');
const logger = require('../../config/logger');

/**
 * Get public media list (no auth required)
 */
const getPublicMedia = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { isPublic: true, isHidden: false }; // Filter out hidden media
    if (category) query.category = category;

    const media = await Media.find(query)
      .populate('user', '_id username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(query);

    logger.info(`Fetched ${media.length} public media items`);
    response.success(res, 'Public media retrieved', {
      items: media, // Changed from 'media' to 'items' for consistency
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error('Error fetching public media:', err);
    response.error(res, 'Failed to fetch media', 500);
  }
};

/**
 * Get media by category (public)
 */
const getMediaByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const media = await Media.find({ category, isPublic: true, isHidden: false }) // Filter out hidden media
      .populate('user', '_id username')
      .sort({ createdAt: -1 });

    response.success(res, `Media in ${category} category`, { items: media }); // Changed to 'items'
  } catch (err) {
    logger.error('Error fetching media by category:', err);
    response.error(res, 'Failed to fetch media', 500);
  }
};

/**
 * Get single media item (public)
 * Hidden images can only be viewed by owner or admin
 */
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('user', '_id username');
    
    if (!media || !media.isPublic) {
      return response.error(res, 'Media not found', 404);
    }

    // Check if media is hidden
    if (media.isHidden) {
      // Allow access only if user is authenticated and is owner or admin
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const isOwner = userId && media.user._id.toString() === userId;
      const isAdmin = userRole === 'admin';

      if (!isOwner && !isAdmin) {
        return response.error(res, 'Media not found', 404);
      }
    }

    response.success(res, 'Media retrieved', { media });
  } catch (err) {
    logger.error('Error fetching media by ID:', err);
    response.error(res, 'Failed to fetch media', 500);
  }
};

module.exports = {
  getPublicMedia,
  getMediaByCategory,
  getMediaById,
};
