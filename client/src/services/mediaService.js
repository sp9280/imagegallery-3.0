// client/src/services/mediaService.js
import api from './api';

/**
 * Like/Unlike media (IP and Device based tracking)
 */
export const toggleLike = async (mediaId) => {
  try {
    const response = await api.post(`/media/interaction/${mediaId}/like`);
    const data = response.data?.data || {};
    return { ...response.data, ...data };
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Check if current device/IP has liked a media
 */
export const checkLikeStatus = async (mediaId) => {
  try {
    const response = await api.get(`/media/interaction/${mediaId}/like-status`);
    const data = response.data?.data || {};
    return { ...response.data, ...data };
  } catch (error) {
    console.error('Error checking like status:', error);
    throw error;
  }
};

/**
 * Add comment to media
 */
export const addComment = async (mediaId, { text, name, email }) => {
  try {
    const response = await api.post(`/media/interaction/${mediaId}/comments`, {
      text,
      name,
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments for media
 */
export const getComments = async (mediaId) => {
  try {
    const response = await api.get(`/media/interaction/${mediaId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Delete comment (owner or admin only)
 */
export const deleteComment = async (mediaId, commentId) => {
  try {
    const response = await api.delete(`/media/${mediaId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

/**
 * Toggle hide/unhide media with advanced settings (owner or admin only)
 */
export const toggleHide = async (mediaId, hideSettings = {}) => {
  try {
    const response = await api.put(`/media/${mediaId}/hide`, hideSettings);
    return response.data;
  } catch (error) {
    console.error('Error toggling hide status:', error);
    throw error;
  }
};

/**
 * Get hide history for a media (owner or admin only)
 */
export const getHideHistory = async (mediaId) => {
  try {
    const response = await api.get(`/media/${mediaId}/hide-history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hide history:', error);
    throw error;
  }
};

/**
 * Bulk hide/unhide media (admin only)
 */
export const bulkHide = async (mediaIds, hideLevel, reason = null, note = null) => {
  try {
    const response = await api.post('/media/bulk/hide', {
      mediaIds,
      hideLevel,
      reason,
      note,
    });
    return response.data;
  } catch (error) {
    console.error('Error in bulk hide operation:', error);
    throw error;
  }
};

/**
 * Edit media details (owner or admin only)
 */
export const editMedia = async (mediaId, updates) => {
  try {
    const response = await api.put(`/media/${mediaId}/edit`, updates);
    return response.data;
  } catch (error) {
    console.error('Error editing media:', error);
    throw error;
  }
};

/**
 * Request unlock for an admin-locked image
 */
export const requestUnlock = async (mediaId, reason) => {
  try {
    const response = await api.post(`/media/${mediaId}/request-unlock`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error requesting unlock:', error);
    throw error;
  }
};

/**
 * Resolve unlock request (admin/coadmin only)
 */
export const resolveUnlock = async (mediaId, action) => {
  try {
    const response = await api.post(`/media/${mediaId}/resolve-unlock`, { action });
    return response.data;
  } catch (error) {
    console.error('Error resolving unlock:', error);
    throw error;
  }
};

/**
 * Track download
 */
export const trackDownload = async (mediaId) => {
  try {
    const response = await api.post(`/media/interaction/${mediaId}/download`);
    return response.data;
  } catch (error) {
    console.error('Error tracking download:', error);
    throw error;
  }
};

/**
 * Get media with IP-aware like status
 */
export const getMediaWithStatus = async (mediaId) => {
  try {
    const response = await api.get(`/media/media-status/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching media with status:', error);
    throw error;
  }
};

/**
 * Get public media list
 */
export const getPublicMedia = async (page = 1, limit = 10, category = null) => {
  try {
    const params = { page, limit };
    if (category) params.category = category;
    const response = await api.get('/media/public', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching public media:', error);
    throw error;
  }
};

/**
 * Get media by category
 */
export const getMediaByCategory = async (category) => {
  try {
    const response = await api.get(`/media/categories/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching media by category:', error);
    throw error;
  }
};

/**
 * Delete media (owner or admin)
 */
export const deleteMedia = async (mediaId) => {
  try {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};

const mediaService = {
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
  getPublicMedia,
  getMediaByCategory,
  deleteMedia,
};

export default mediaService;