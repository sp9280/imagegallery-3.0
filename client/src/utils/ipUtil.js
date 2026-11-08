// client/src/utils/ipUtil.js
/**
 * Utility to track user IP for like system
 * Since we can't get real IP on client-side, we use device fingerprint
 */

// Generate a unique device fingerprint
export const getDeviceFingerprint = () => {
  let fingerprint = localStorage.getItem('deviceFingerprint');
  
  if (!fingerprint) {
    // Create a unique fingerprint based on device info
    const randomId = Math.random().toString(36).substring(2, 11);
    const timestamp = Date.now().toString(36);
    fingerprint = `${navigator.userAgent.substring(0, 20)}_${randomId}_${timestamp}`;
    
    localStorage.setItem('deviceFingerprint', fingerprint);
  }
  
  return fingerprint;
};

// Check if user already liked from this device
export const hasLiked = (mediaId) => {
  const likes = JSON.parse(localStorage.getItem('likedMedia') || '{}');
  return likes[mediaId] || false;
};

// Mark as liked
export const markAsLiked = (mediaId) => {
  const likes = JSON.parse(localStorage.getItem('likedMedia') || '{}');
  likes[mediaId] = true;
  localStorage.setItem('likedMedia', JSON.stringify(likes));
};

// Unmark like
export const unmarkLike = (mediaId) => {
  const likes = JSON.parse(localStorage.getItem('likedMedia') || '{}');
  delete likes[mediaId];
  localStorage.setItem('likedMedia', JSON.stringify(likes));
};