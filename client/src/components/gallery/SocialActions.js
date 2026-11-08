// Social Features Component (Likes, Shares, Comments)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';
import { showToast } from '../common/Toast';

const SocialActions = ({ mediaId, initialLikes = 0, initialComments = 0, onLike, onComment, onShare }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike && onLike(mediaId, !isLiked);
    showToast.success(isLiked ? 'Unliked!' : 'Liked!');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showToast.success(isSaved ? 'Removed from saved' : 'Saved!');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/media/${mediaId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this image!',
        url: shareUrl
      }).then(() => {
        showToast.success('Shared successfully!');
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      });
    } else {
      copyToClipboard(shareUrl);
    }
    
    onShare && onShare(mediaId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast.success('Link copied to clipboard!');
  };

  const iconButtonClass = "p-3 rounded-full transition-all transform hover:scale-110 active:scale-95";

  return (
    <div className="flex items-center gap-4">
      {/* Like Button */}
      <motion.button
        onClick={handleLike}
        className={`${iconButtonClass} ${
          isLiked 
            ? 'bg-red-100 text-red-500' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
        }`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <FiHeart 
              size={20} 
              fill={isLiked ? 'currentColor' : 'none'}
              className="transition-all"
            />
          </motion.div>
          {likes > 0 && (
            <span className="text-sm font-semibold">{likes}</span>
          )}
        </div>
      </motion.button>

      {/* Comment Button */}
      <motion.button
        onClick={() => onComment && onComment(mediaId)}
        className={`${iconButtonClass} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-500`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex items-center gap-2">
          <FiMessageCircle size={20} />
          {initialComments > 0 && (
            <span className="text-sm font-semibold">{initialComments}</span>
          )}
        </div>
      </motion.button>

      {/* Share Button */}
      <motion.button
        onClick={handleShare}
        className={`${iconButtonClass} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 hover:text-green-500`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <FiShare2 size={20} />
      </motion.button>

      {/* Save/Bookmark Button */}
      <motion.button
        onClick={handleSave}
        className={`${iconButtonClass} ${
          isSaved 
            ? 'bg-yellow-100 text-yellow-600' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 hover:text-yellow-600'
        }`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <FiBookmark 
          size={20} 
          fill={isSaved ? 'currentColor' : 'none'}
        />
      </motion.button>
    </div>
  );
};

export default SocialActions;