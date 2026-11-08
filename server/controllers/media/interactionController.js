// server/controllers/media/interactionController.js
const Media = require('../../models/Media');
const User = require('../../models/User');
const response = require('../../utils/response');
const logger = require('../../config/logger');

/**
 * Get client IP address from request (normalized for localhost & proxies)
 */
const getClientIP = (req) => {
  let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
           req.headers['x-real-ip'] || 
           req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           '127.0.0.1';
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  return ip;
};

/**
 * Get composite client identifiers: IP, Device ID, User ID
 * Enforces: One device, one IP = exactly one like
 */
const getClientIdentifiers = (req) => {
  const ip = getClientIP(req);
  const rawDeviceId = req.headers['x-device-id'] || req.headers['x-client-id'] || '';
  const deviceId = typeof rawDeviceId === 'string' ? rawDeviceId.trim() : '';
  const userId = req.user?.id || req.user?._id;

  const identifiers = [];
  if (ip && ip !== 'unknown') {
    identifiers.push(`ip:${ip}`);
    identifiers.push(ip); // backward compatibility with older stored entries
  }
  if (deviceId) {
    identifiers.push(`dev:${deviceId}`);
  }
  if (userId) {
    identifiers.push(`usr:${userId}`);
  }
  return { ip, deviceId, userId, identifiers };
};

/**
 * Like/Unlike media with strict Device + IP tracking (1 Device / 1 IP = 1 like only)
 * Multiple clicks toggle between liked and unliked, preventing repeated stacking
 */
const toggleLike = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { ip, deviceId, userId, identifiers } = getClientIdentifiers(req);

    // Validate mediaId
    if (!mediaId || !mediaId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.error(res, 'Invalid media ID', 400);
    }

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    // Safely parse current liked array
    let currentLiked = [];
    if (Array.isArray(media.likedByIPs)) {
      currentLiked = [...media.likedByIPs];
    } else if (typeof media.likedByIPs === 'string') {
      try {
        currentLiked = JSON.parse(media.likedByIPs);
      } catch (e) {
        currentLiked = [];
      }
    }

    // Check if any identifier matches (1 IP or 1 Device = 1 Like)
    const alreadyLiked = identifiers.some(id => currentLiked.includes(id));

    if (alreadyLiked) {
      // Remove like: filter out all associated identifiers for this caller
      currentLiked = currentLiked.filter(id => !identifiers.includes(id));
      media.likedByIPs = currentLiked;
      media.likes = Math.max(0, (media.likes || 1) - 1);

      // Force Sequelize to detect JSON update
      media.changed('likedByIPs', true);
      media.changed('likes', true);
      await media.save();

      logger.info(`✅ Like removed from media ${mediaId} by Device ${deviceId || 'N/A'}, IP ${ip}`);
      return response.success(res, 'Like removed', {
        likes: media.likes,
        isLiked: false,
      });
    } else {
      // Add like: record device and IP
      if (deviceId) {
        currentLiked.push(`dev:${deviceId}`);
      }
      if (ip && ip !== 'unknown') {
        currentLiked.push(`ip:${ip}`);
        currentLiked.push(ip);
      }
      if (userId) {
        currentLiked.push(`usr:${userId}`);
      }

      currentLiked = Array.from(new Set(currentLiked));
      media.likedByIPs = currentLiked;
      media.likes = (media.likes || 0) + 1;

      // Force Sequelize to detect JSON update
      media.changed('likedByIPs', true);
      media.changed('likes', true);
      await media.save();

      logger.info(`✅ Like added to media ${mediaId} by Device ${deviceId || 'N/A'}, IP ${ip}`);
      return response.success(res, 'Like added', {
        likes: media.likes,
        isLiked: true,
      });
    }
  } catch (err) {
    logger.error('Error toggling like:', err);
    return response.error(res, 'Failed to toggle like', 500);
  }
};

/**
 * Check if current device or IP has liked a media
 */
const checkLikeStatus = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { identifiers } = getClientIdentifiers(req);

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    let currentLiked = [];
    if (Array.isArray(media.likedByIPs)) {
      currentLiked = media.likedByIPs;
    } else if (typeof media.likedByIPs === 'string') {
      try {
        currentLiked = JSON.parse(media.likedByIPs);
      } catch (e) {
        currentLiked = [];
      }
    }

    const isLiked = identifiers.some(id => currentLiked.includes(id));

    return response.success(res, 'Like status retrieved', {
      isLiked,
      likes: media.likes || 0,
    });
  } catch (err) {
    logger.error('Error checking like status:', err);
    return response.error(res, 'Failed to check like status', 500);
  }
};

/**
 * Add comment to media
 */
const addComment = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { text, name, email } = req.body;
    const clientIP = getClientIP(req);
    const userId = req.user?.id;

    // Validate comment text
    if (!text || text.trim().length === 0) {
      return response.error(res, 'Comment text is required', 400);
    }

    if (text.length > 500) {
      return response.error(res, 'Comment must be 500 characters or less', 400);
    }

    // Validate mediaId
    if (!mediaId || !mediaId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.error(res, 'Invalid media ID', 400);
    }

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    // Check if public comment requires name
    if (!userId && !name) {
      return response.error(res, 'Name is required for public comments', 400);
    }

    // Prepare comment object
    const comment = {
      text: text.trim(),
      isPublic: !userId,
      ipAddress: clientIP,
      createdAt: new Date(),
    };

    // Add user info if authenticated
    if (userId) {
      comment.user = userId;
      const user = await User.findById(userId);
      if (user) {
        comment.username = user.username;
      }
    } else {
      // Public comment
      comment.name = name?.trim();
      if (email) {
        comment.email = email?.trim();
      }
    }

    // Add comment to media
    if (!media.comments) {
      media.comments = [];
    }
    media.comments.push(comment);
    await media.save();

    logger.info(`✅ Comment added to media ${mediaId}`);
    response.success(res, 'Comment added successfully', {
      comment,
      totalComments: media.comments.length,
    });
  } catch (err) {
    logger.error('Error adding comment:', err);
    response.error(res, 'Failed to add comment', 500);
  }
};

/**
 * Get comments for media
 */
const getComments = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId).populate('comments.user', 'username');
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    response.success(res, 'Comments retrieved', {
      comments: media.comments || [],
      total: (media.comments || []).length,
    });
  } catch (err) {
    logger.error('Error fetching comments:', err);
    response.error(res, 'Failed to fetch comments', 500);
  }
};

/**
 * Delete comment (owner or admin only)
 */
const deleteComment = async (req, res) => {
  try {
    const { mediaId, commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    // Find the comment
    const commentIndex = media.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return response.error(res, 'Comment not found', 404);
    }

    const comment = media.comments[commentIndex];

    // Check permissions: comment owner, media owner, or admin
    const isCommentOwner = comment.user?.toString() === userId;
    const isMediaOwner = media.user.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isCommentOwner && !isMediaOwner && !isAdmin) {
      return response.error(res, 'Unauthorized to delete this comment', 403);
    }

    // Remove comment
    media.comments.splice(commentIndex, 1);
    await media.save();

    logger.info(`✅ Comment deleted from media ${mediaId}`);
    response.success(res, 'Comment deleted successfully');
  } catch (err) {
    logger.error('Error deleting comment:', err);
    response.error(res, 'Failed to delete comment', 500);
  }
};

/**
 * Toggle hide/unhide media with advanced features (owner or admin only)
 * Now supports: hide levels, reasons, notes, history tracking, scheduled hide/unhide
 */
const toggleHide = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { 
      hideLevel, 
      reason, 
      note, 
      scheduledHideAt, 
      scheduledUnhideAt 
    } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const username = req.user.username;
    const clientIP = getClientIP(req);

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    // Check permissions: owner or admin
    const isOwner = media.user.toString() === userId;
    const isAdmin = userRole === 'admin' || userRole === 'coadmin';

    if (!isOwner && !isAdmin) {
      return response.error(res, 'Unauthorized to hide/unhide this media', 403);
    }

    // Store previous state for history
    const previousState = {
      isHidden: media.isHidden,
      hideLevel: media.hideLevel || 'visible'
    };

    // Determine action and new hide level
    let action;
    let newHideLevel;
    
    if (hideLevel) {
      // Explicit hide level provided
      newHideLevel = hideLevel;
      if (hideLevel === 'visible') {
        action = 'unhide';
      } else if (hideLevel === 'archived') {
        action = 'archive';
      } else {
        action = hideLevel; // 'soft_hide' or 'hard_hide'
      }
    } else {
      // Simple toggle (backward compatible)
      if (media.isHidden) {
        action = 'unhide';
        newHideLevel = 'visible';
      } else {
        action = 'hide';
        newHideLevel = 'hard_hide'; // Default to hard hide
      }
    }

    // Update media fields
    media.isHidden = newHideLevel !== 'visible';
    media.hideLevel = newHideLevel;
    media.hideReason = reason || media.hideReason;
    media.hideNote = note || media.hideNote;
    media.hiddenBy = media.isHidden ? userId : null;
    media.hiddenByUsername = media.isHidden ? username : null;
    media.hiddenAt = media.isHidden ? new Date() : null;
    media.scheduledHideAt = scheduledHideAt || media.scheduledHideAt;
    media.scheduledUnhideAt = scheduledUnhideAt || media.scheduledUnhideAt;

    await media.save();

    // Create history record
    const MediaHideHistory = require('../../models/MediaHideHistory');
    await MediaHideHistory.create({
      mediaId,
      action,
      hideLevel: newHideLevel,
      reason: reason || null,
      note: note || null,
      performedBy: userId,
      performedByRole: isOwner ? 'owner' : userRole,
      performedByUsername: username,
      ipAddress: clientIP,
      userAgent: req.headers['user-agent'] || null,
      previousState,
      newState: {
        isHidden: media.isHidden,
        hideLevel: media.hideLevel
      },
      scheduledHideAt: scheduledHideAt || null,
      scheduledUnhideAt: scheduledUnhideAt || null
    });

    logger.info(`✅ Media ${mediaId} ${action} (${newHideLevel}) by ${username} (${userRole})`);
    response.success(res, `Media ${action} successfully`, {
      isHidden: media.isHidden,
      hideLevel: media.hideLevel,
      action
    });
  } catch (err) {
    logger.error('Error toggling hide status:', err);
    response.error(res, 'Failed to toggle hide status', 500);
  }
};

/**
 * Edit media details (owner or admin only)
 */
const editMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { title, description, category, tags, license, isPublic, metadata } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    // Check permissions: owner or admin
    const isOwner = media.user.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return response.error(res, 'Unauthorized to edit this media', 403);
    }

    // Update allowed fields
    if (title !== undefined) {
      if (!title.trim()) {
        return response.error(res, 'Title cannot be empty', 400);
      }
      media.title = title.trim();
    }

    if (description !== undefined) {
      media.description = description?.trim() || '';
    }

    if (category !== undefined) {
      const validCategories = ['General', 'Nature', 'Architecture', 'People', 'Technology', 'Art', 'Sports', 'Food'];
      if (!validCategories.includes(category)) {
        return response.error(res, 'Invalid category', 400);
      }
      media.category = category;
    }

    if (tags !== undefined) {
      media.tags = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    if (license !== undefined) {
      const validLicenses = ['CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-NC-4.0', 'CC0', 'Copyright'];
      if (!validLicenses.includes(license)) {
        return response.error(res, 'Invalid license', 400);
      }
      media.license = license;
    }

    if (isPublic !== undefined) {
      media.isPublic = isPublic === true || isPublic === 'true';
    }

    // Update metadata if provided
    if (metadata !== undefined) {
      if (!media.metadata) {
        media.metadata = {};
      }
      
      // Update specific metadata fields
      if (metadata.artist !== undefined) {
        media.metadata.artist = metadata.artist?.trim() || undefined;
      }
      if (metadata.locationText !== undefined) {
        media.metadata.locationText = metadata.locationText?.trim() || undefined;
      }
      if (metadata.cameraModel !== undefined) {
        media.metadata.cameraModel = metadata.cameraModel?.trim() || undefined;
      }
      if (metadata.cameraMake !== undefined) {
        media.metadata.cameraMake = metadata.cameraMake?.trim() || undefined;
      }
      if (metadata.resolution !== undefined) {
        media.metadata.resolution = metadata.resolution?.trim() || undefined;
      }
      
      // Mark metadata as modified for Mongoose to save it
      media.markModified('metadata');
    }

    await media.save();

    logger.info(`✅ Media ${mediaId} updated by user ${userId}`);
    response.success(res, 'Media updated successfully', {
      media: {
        id: media._id,
        title: media.title,
        description: media.description,
        category: media.category,
        tags: media.tags,
        license: media.license,
        isPublic: media.isPublic,
        isHidden: media.isHidden,
        metadata: media.metadata
      },
    });
  } catch (err) {
    logger.error('Error editing media:', err);
    response.error(res, 'Failed to edit media', 500);
  }
};

/**
 * Get hide history for a specific media (admin and owner only)
 */
const getHideHistory = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is admin or owner of the media
    const media = await Media.findById(mediaId);
    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    const isOwner = media.user.toString() === userId;
    const isAdmin = userRole === 'admin' || userRole === 'coadmin';

    if (!isOwner && !isAdmin) {
      return response.error(res, 'Unauthorized to view hide history', 403);
    }

    const MediaHideHistory = require('../../models/MediaHideHistory');
    const history = await MediaHideHistory.find({ mediaId })
      .sort({ createdAt: -1 })
      .populate('performedBy', 'username email')
      .lean();

    response.success(res, 'Hide history retrieved', {
      history,
      total: history.length
    });
  } catch (err) {
    logger.error('Error getting hide history:', err);
    response.error(res, 'Failed to get hide history', 500);
  }
};

/**
 * Bulk hide/unhide media (admin only)
 */
const bulkHide = async (req, res) => {
  try {
    const { mediaIds, hideLevel, reason, note } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const username = req.user.username;
    const clientIP = getClientIP(req);

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return response.error(res, 'mediaIds array is required', 400);
    }

    const isAdmin = userRole === 'admin' || userRole === 'coadmin';
    if (!isAdmin) {
      return response.error(res, 'Only admins can perform bulk operations', 403);
    }

    const validHideLevels = ['visible', 'soft_hide', 'hard_hide', 'archived'];
    if (!validHideLevels.includes(hideLevel)) {
      return response.error(res, 'Invalid hide level', 400);
    }

    // Determine action
    let action;
    if (hideLevel === 'visible') {
      action = 'unhide';
    } else if (hideLevel === 'archived') {
      action = 'archive';
    } else {
      action = hideLevel;
    }

    const results = {
      success: [],
      failed: []
    };

    const MediaHideHistory = require('../../models/MediaHideHistory');

    for (const mediaId of mediaIds) {
      try {
        const media = await Media.findById(mediaId);
        if (!media) {
          results.failed.push({ mediaId, error: 'Media not found' });
          continue;
        }

        // Store previous state
        const previousState = {
          isHidden: media.isHidden,
          hideLevel: media.hideLevel || 'visible'
        };

        // Update media
        media.isHidden = hideLevel !== 'visible';
        media.hideLevel = hideLevel;
        media.hideReason = reason || media.hideReason;
        media.hideNote = note || media.hideNote;
        media.hiddenBy = media.isHidden ? userId : null;
        media.hiddenByUsername = media.isHidden ? username : null;
        media.hiddenAt = media.isHidden ? new Date() : null;

        await media.save();

        // Create history record
        await MediaHideHistory.create({
          mediaId,
          action,
          hideLevel,
          reason: reason || null,
          note: note || null,
          performedBy: userId,
          performedByRole: userRole,
          performedByUsername: username,
          ipAddress: clientIP,
          userAgent: req.headers['user-agent'] || null,
          previousState,
          newState: {
            isHidden: media.isHidden,
            hideLevel: media.hideLevel
          }
        });

        results.success.push(mediaId);
        logger.info(`✅ Bulk ${action}: Media ${mediaId} by ${username}`);
      } catch (err) {
        results.failed.push({ mediaId, error: err.message });
        logger.error(`❌ Bulk ${action} failed for media ${mediaId}:`, err);
      }
    }

    response.success(res, `Bulk ${action} completed`, {
      results,
      successCount: results.success.length,
      failedCount: results.failed.length
    });
  } catch (err) {
    logger.error('Error in bulk hide operation:', err);
    response.error(res, 'Failed to perform bulk hide operation', 500);
  }
};

/**
 * Track download
 */
const trackDownload = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findByIdAndUpdate(
      mediaId,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!media) {
      return response.error(res, 'Media not found', 404);
    }

    logger.info(`📥 Download tracked for media ${mediaId}`);
    response.success(res, 'Download tracked', {
      downloads: media.downloads,
    });
  } catch (err) {
    logger.error('Error tracking download:', err);
    response.error(res, 'Failed to track download', 500);
  }
};

/**
 * Get media with IP-aware like status
 * Hidden images can only be viewed by owner or admin
 */
const getMediaWithStatus = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const clientIP = getClientIP(req);

    const media = await Media.findById(mediaId).populate('user', 'username email');
    if (!media) {
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

    // Check like status for this IP
    const isLiked = media.likedByIPs && media.likedByIPs.includes(clientIP);

    response.success(res, 'Media retrieved with status', {
      media: {
        ...media.toObject(),
        isLiked,
      },
    });
  } catch (err) {
    logger.error('Error fetching media with status:', err);
    response.error(res, 'Failed to fetch media', 500);
  }
};

module.exports = {
  toggleLike,
  checkLikeStatus,
  addComment,
  getComments,
  deleteComment,
  toggleHide,
  getHideHistory,
  bulkHide,
  editMedia,
  trackDownload,
  getMediaWithStatus,
};