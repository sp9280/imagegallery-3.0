// client/src/components/gallery/Comments.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getCurrentTheme } from "../../styles/theme";
import api from "../../services/api";

const Comments = ({ mediaId, comments = [], onClose, onAddComment, isPublic = true }) => {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const currentTheme = getCurrentTheme();
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    // For public comments (non-authenticated users), require a name
    if (!user && !commentName.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      await onAddComment({
        text: newComment,
        name: user ? null : commentName, // Authenticated users don't need to provide name
        username: user?.username,
        email: commentEmail || null,
      });
      setNewComment("");
      setCommentName("");
      setCommentEmail("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) return;
    
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await api.delete(`/admin/comments/${mediaId}/${commentId}`);
      setCommentList(commentList.filter(c => c._id !== commentId));
      alert("Comment deleted successfully");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className={`modal-overlay ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <div className={`modal-window ${currentTheme === 'dark' ? 'dark-modal' : ''}`}>
        {/* Header */}
        <div className="modal-header">
          <h3>Comments</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {commentList.length > 0 ? (
            commentList.map((c, index) => (
              <div key={c._id || index} className="comment-item" style={{ position: 'relative' }}>
                <div className="comment-header">
                  <strong className="comment-author">
                    {c.username || c.name || "Anonymous"}
                  </strong>
                  <span className="comment-time">
                    {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  {isAdmin && c._id && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="Delete comment (Admin)"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            ))
          ) : (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="comment-input-section">
          {/* Name field ONLY for non-authenticated users */}
          {!user && (
            <div className="comment-form-group">
              <input
                type="text"
                placeholder="Your name (required)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                maxLength="50"
                className="comment-form-input name-input"
              />
            </div>
          )}

          {/* Comment text */}
          <div className="comment-form-group">
            <textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength="500"
              rows="3"
              className="comment-form-textarea"
            />
            <small className="char-count">
              {newComment.length}/500 characters
            </small>
          </div>

          {/* Send Button */}
          <button
            onClick={handleAddComment}
            className="btn-send-comment"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
