// client/src/components/gallery/ImageModal.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comments from "./Comments";
import HideReasonModal from "./HideReasonModal";
import mediaService from "../../services/mediaService";

const ImageModal = ({ item, onClose, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showHideReasonModal, setShowHideReasonModal] = useState(false);
  const [comments, setComments] = useState(item.comments || []);
  const [editedDetails, setEditedDetails] = useState({
    title: item.title || '',
    description: item.description || '',
    photographer: item.metadata?.artist || '',
    location: item.metadata?.locationText || '',
    camera: item.metadata?.cameraModel || '',
    resolution: item.metadata?.resolution || ''
  });

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
  const BACKEND_BASE = API_BASE.replace('/api', '');
  const fullImageUrl = item.url?.startsWith('http') ? item.url : `${BACKEND_BASE}${item.url}`;

  const isOwner = user && user._id === item.user?._id;
  const isAdmin = user && user.role === 'admin';
  const canModerate = isOwner || isAdmin;

  const metadata = item.metadata || {};
  const photographer = metadata.artist || item.user?.username;
  const captureDate = metadata.captureDate ? new Date(metadata.captureDate) : null;
  const locationText = metadata.locationText || (metadata.location
    ? `${metadata.location.latitude.toFixed(5)}, ${metadata.location.longitude.toFixed(5)}`
    : null);
  const resolution = metadata.resolution;
  const hasMetadata = Boolean(
    metadata.cameraMake ||
    metadata.cameraModel ||
    metadata.lensModel ||
    metadata.exposureTime ||
    metadata.aperture ||
    metadata.iso ||
    metadata.focalLength ||
    metadata.location ||
    metadata.locationText ||
    metadata.resolution ||
    captureDate ||
    photographer
  );

  React.useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await mediaService.checkLikeStatus(item._id);
        setLiked(response.data.isLiked);
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };
    checkLikeStatus();
  }, [item._id]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      const response = await mediaService.toggleLike(item._id);
      setLiked(response.data.isLiked);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Failed to like media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Fetch the image as a blob to bypass CORS issues
      const response = await fetch(fullImageUrl);
      const blob = await response.blob();
      
      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.originalName || `download-${Date.now()}${item.mimetype?.includes('image') ? '.jpg' : '.mp4'}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Track download
      await mediaService.trackDownload(item._id).catch(err => console.log('Download tracking failed'));
      
      alert('Download started!');
    } catch (error) {
      console.error("Failed to download:", error);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHideClick = () => {
    setShowHideReasonModal(true);
  };

  const handleHideConfirm = async (hideSettings) => {
    if (!canModerate) return;
    try {
      setLoading(true);
      const response = await mediaService.toggleHide(item._id, hideSettings);
      if (onUpdate) onUpdate();
      alert(`${response.message || 'Media visibility updated'}`);
      onClose();
    } catch (error) {
      console.error("Failed to update visibility:", error);
      alert(error.response?.data?.message || "Failed to update visibility");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canModerate) return;
    if (!window.confirm('Are you sure you want to delete this media? This action cannot be undone.')) return;
    
    try {
      await mediaService.deleteMedia(item._id);
      if (onUpdate) onUpdate();
      alert("Media deleted successfully");
      onClose();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete media");
    }
  };

  const handleSaveDetails = async () => {
    if (!canModerate) return;
    
    try {
      const updates = {
        title: editedDetails.title,
        description: editedDetails.description,
        metadata: {
          ...item.metadata,
          artist: editedDetails.photographer || undefined,
          locationText: editedDetails.location || undefined,
          cameraModel: editedDetails.camera || undefined,
          resolution: editedDetails.resolution || undefined
        }
      };
      
      await mediaService.editMedia(item._id, updates);
      if (onUpdate) onUpdate();
      alert("Details updated successfully");
      setIsEditingDetails(false);
      onClose();
    } catch (error) {
      console.error("Failed to update details:", error);
      alert("Failed to update details");
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      const response = await mediaService.addComment(item._id, {
        text: commentData.text,
        name: commentData.name,
        email: commentData.email,
      });
      
      // Add new comment to local state immediately for instant update
      const newComment = {
        text: commentData.text,
        username: user?.username,
        name: commentData.name,
        createdAt: new Date().toISOString()
      };
      setComments([...comments, newComment]);
      
      if (onUpdate) onUpdate();
      setShowComments(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    }
  };

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="image-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="image-modal-container" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto' }}>
        <button className="modal-close-btn" onClick={onClose} title="Close (ESC)">
          ✕
        </button>

        <div className="image-modal-content">
          <div className="modal-image-section">
            <img 
              src={fullImageUrl} 
              alt={item.title} 
              className="modal-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
          </div>

          <div className="modal-details-section">
            <div className="modal-header">
              <h2 className="modal-title">{item.title}</h2>
              <div className="modal-meta">
                <span className="modal-category">#{item.category}</span>
                {item.license && <span className="modal-license">{item.license}</span>}
              </div>
            </div>

            {item.description && (
              <div className="modal-description">
                <p>{item.description}</p>
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="modal-tags">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="modal-tag">{tag}</span>
                ))}
              </div>
            )}

            {hasMetadata && (
              <div className="modal-metadata">
                <h3 className="metadata-title">Shot Details</h3>
                <div className="metadata-grid">
                  {(metadata.cameraMake || metadata.cameraModel) && (
                    <div className="metadata-item">
                      <span className="metadata-label">Camera</span>
                      <span className="metadata-value">{[metadata.cameraMake, metadata.cameraModel].filter(Boolean).join(' ')}</span>
                    </div>
                  )}
                  {metadata.lensModel && (
                    <div className="metadata-item">
                      <span className="metadata-label">Lens</span>
                      <span className="metadata-value">{metadata.lensModel}</span>
                    </div>
                  )}
                  {photographer && (
                    <div className="metadata-item">
                      <span className="metadata-label">Photographer</span>
                      <span className="metadata-value">{photographer}</span>
                    </div>
                  )}
                  {captureDate && (
                    <div className="metadata-item">
                      <span className="metadata-label">Captured</span>
                      <span className="metadata-value">{captureDate.toLocaleString()}</span>
                    </div>
                  )}
                  {metadata.exposureTime && (
                    <div className="metadata-item">
                      <span className="metadata-label">Exposure</span>
                      <span className="metadata-value">{metadata.exposureTime}</span>
                    </div>
                  )}
                  {metadata.aperture && (
                    <div className="metadata-item">
                      <span className="metadata-label">Aperture</span>
                      <span className="metadata-value">f/{metadata.aperture}</span>
                    </div>
                  )}
                  {metadata.iso && (
                    <div className="metadata-item">
                      <span className="metadata-label">ISO</span>
                      <span className="metadata-value">{metadata.iso}</span>
                    </div>
                  )}
                  {metadata.focalLength && (
                    <div className="metadata-item">
                      <span className="metadata-label">Focal Length</span>
                      <span className="metadata-value">{metadata.focalLength}mm</span>
                    </div>
                  )}
                  {locationText && (
                    <div className="metadata-item">
                      <span className="metadata-label">Location</span>
                      <span className="metadata-value">{locationText}</span>
                    </div>
                  )}
                  {resolution && (
                    <div className="metadata-item">
                      <span className="metadata-label">Resolution</span>
                      <span className="metadata-value">{resolution}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="modal-user-info">
              <span className="modal-user">By: {item.user?.username || 'Anonymous'}</span>
              <span className="modal-date">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="modal-stats">
              <div className="stat-item">
                <span className="stat-icon">♥</span>
                <span className="stat-label">Likes</span>
                <span className="stat-value">{likes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-label">Comments</span>
                <span className="stat-value">{comments.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">↓</span>
                <span className="stat-label">Downloads</span>
                <span className="stat-value">{item.downloads || 0}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className={`modal-action-btn like-btn ${liked ? "liked" : ""}`}
                onClick={toggleLike}
                disabled={loading}
              >
                {liked ? "Liked" : "Like"}
              </button>

              <button
                className="modal-action-btn comment-btn"
                onClick={() => setShowComments(true)}
              >
                Comment
              </button>

              <button
                className="modal-action-btn download-btn"
                onClick={handleDownload}
              >
                Download
              </button>

              <button
                className="modal-action-btn share-btn"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href + `?media=${item._id}`);
                  alert('Link copied to clipboard!');
                }}
              >
                Share
              </button>
            </div>

            {canModerate && (
              <>
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f97316' }}>
                    Content Management
                  </h3>
                </div>
                <div className="modal-moderator-actions">
                  <button 
                    className="modal-action-btn edit-btn" 
                    onClick={() => setIsEditingDetails(true)}
                  >
                    Edit Details
                  </button>
                  <button className="modal-action-btn hide-btn" onClick={handleHideClick}>
                    {item.isHidden ? "Change Visibility" : "Hide"}
                  </button>
                  <button className="modal-action-btn delete-btn" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {showComments && (
          <div className="nested-comments-modal">
            <Comments
              mediaId={item._id}
              comments={comments}
              onClose={() => setShowComments(false)}
              onAddComment={handleAddComment}
              isPublic={item.isPublic}
            />
          </div>
        )}

        {isEditingDetails && canModerate && (
          <div className="nested-comments-modal">
            <div className="modal-window" style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h3>Edit Media Details</h3>
                <button className="close-btn" onClick={() => setIsEditingDetails(false)}>×</button>
              </div>
              <div className="edit-details-form" style={{ padding: '20px' }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
                  <input
                    type="text"
                    value={editedDetails.title}
                    onChange={(e) => setEditedDetails({...editedDetails, title: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                  <textarea
                    value={editedDetails.description}
                    onChange={(e) => setEditedDetails({...editedDetails, description: e.target.value})}
                    rows="3"
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Photographer</label>
                  <input
                    type="text"
                    value={editedDetails.photographer}
                    onChange={(e) => setEditedDetails({...editedDetails, photographer: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Location</label>
                  <input
                    type="text"
                    value={editedDetails.location}
                    onChange={(e) => setEditedDetails({...editedDetails, location: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Camera</label>
                  <input
                    type="text"
                    value={editedDetails.camera}
                    onChange={(e) => setEditedDetails({...editedDetails, camera: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Resolution</label>
                  <input
                    type="text"
                    value={editedDetails.resolution}
                    onChange={(e) => setEditedDetails({...editedDetails, resolution: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={handleSaveDetails}
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      background: 'linear-gradient(to right, #f97316, #d97706)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingDetails(false)}
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      background: '#6b7280', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hide Reason Modal */}
      <HideReasonModal
        isOpen={showHideReasonModal}
        onClose={() => setShowHideReasonModal(false)}
        onConfirm={handleHideConfirm}
        currentHideLevel={item.hideLevel || 'visible'}
      />
    </div>
  );
};

export default ImageModal;
