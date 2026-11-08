// server/controllers/media/adminController.js
const Media = require('../../models/Media');
const User = require('../../models/User');
const response = require('../../utils/response');
const logger = require('../../config/logger');

/**
 * Get admin dashboard data
 */
const getAdminDashboard = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return response.error(res, 'Access denied. Admin role required.', 403);
    }

    const totalMedia = await Media.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total comments and likes
    const mediaWithStats = await Media.find();
    const totalComments = mediaWithStats.reduce((sum, media) => sum + (media.comments?.length || 0), 0);
    const totalLikes = mediaWithStats.reduce((sum, media) => sum + (media.likes?.length || 0), 0);

    // Get recent activity
    const recentMedia = await Media.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = recentMedia.map(media => ({
      description: `${media.user?.username || 'User'} uploaded "${media.title}"`,
      timestamp: media.createdAt,
      mediaId: media._id,
      title: media.title,
      url: media.url,
      isPublic: media.isPublic,
      author: media.user?.username || 'Unknown',
      likes: media.likes?.length || 0,
      commentsCount: media.comments?.length || 0,
    }));

    // Fetch all pictures so the admin can monitor every picture on their dashboard
    const allPictures = recentMedia.map(media => ({
      _id: media._id,
      title: media.title,
      url: media.url,
      isPublic: media.isPublic,
      category: media.category,
      createdAt: media.createdAt,
      author: media.user?.username || 'Unknown',
      likesCount: media.likes?.length || 0,
      commentsCount: media.comments?.length || 0,
    }));

    const dashboardData = {
      totalMedia,
      totalUsers,
      totalComments,
      totalLikes,
      recentActivity,
      recentPictures: allPictures,
    };

    logger.info('Admin dashboard data retrieved');
    response.success(res, 'Dashboard data retrieved', dashboardData);
  } catch (err) {
    logger.error('Error fetching dashboard data:', err);
    response.error(res, 'Failed to fetch dashboard data', 500);
  }
};

/**
 * Manage media (admin only)
 */
const manageMedia = async (req, res) => {
  try {
    const { action, mediaId } = req.body;

    if (!mediaId) {
      return response.error(res, 'Media ID required', 400);
    }

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    switch (action) {
      case 'approve':
        media.isPublic = true;
        break;
      case 'reject':
        media.isPublic = false;
        break;
      case 'delete':
        await Media.findByIdAndDelete(mediaId);
        return response.success(res, 'Media deleted successfully');
      default:
        return response.error(res, 'Invalid action', 400);
    }

    await media.save();
    logger.info(`Media ${action}d: ${mediaId}`);
    response.success(res, `Media ${action}d successfully`);
  } catch (err) {
    logger.error('Error managing media:', err);
    response.error(res, 'Failed to manage media', 500);
  }
};

/**
 * Get all media for admin review
 */
const getAllMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};

    if (status === 'pending') query.isPublic = false;
    else if (status === 'approved') query.isPublic = true;

    const media = await Media.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(query);

    response.success(res, 'Media retrieved for admin', {
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error('Error fetching all media:', err);
    response.error(res, 'Failed to fetch media', 500);
  }
};

module.exports = {
  getAdminDashboard,
  manageMedia,
  getAllMedia,
};
