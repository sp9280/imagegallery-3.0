// server/controllers/media/statsController.js
const Media = require('../../models/Media');
const User = require('../../models/User');
const response = require('../../utils/response');
const logger = require('../../config/logger');

/**
 * Get media statistics
 */
const getStats = async (req, res) => {
  try {
    const totalMedia = await Media.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSize = await Media.aggregate([
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);
    const categories = await Media.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      totalMedia,
      totalUsers,
      totalSize: totalSize[0]?.total || 0,
      categories: categories.map(cat => ({ name: cat._id, count: cat.count })),
    };

    logger.info('Media stats retrieved');
    response.success(res, 'Statistics retrieved', { stats });
  } catch (err) {
    logger.error('Error fetching stats:', err);
    response.error(res, 'Failed to fetch statistics', 500);
  }
};

/**
 * Get user-specific stats
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userMedia = await Media.find({ user: userId });
    const totalUploads = userMedia.length;
    const totalSize = userMedia.reduce((sum, media) => sum + media.size, 0);
    const categories = userMedia.reduce((acc, media) => {
      acc[media.category] = (acc[media.category] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalUploads,
      totalSize,
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
    };

    response.success(res, 'User statistics retrieved', { stats });
  } catch (err) {
    logger.error('Error fetching user stats:', err);
    response.error(res, 'Failed to fetch user statistics', 500);
  }
};

module.exports = {
  getStats,
  getUserStats,
};
