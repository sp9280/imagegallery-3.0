// Enhanced Media Card with stunning animations and interactions
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import ImageModal from './ImageModal';
import SocialActions from './SocialActions';
import { fadeInUp, cardHover, imageZoom } from '../../utils/animations';
import { FiEye, FiEdit2, FiUser } from 'react-icons/fi';

const EnhancedMediaCard = ({ item, onUpdate, index = 0 }) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  const BACKEND_BASE = API_BASE.replace('/api', '');
  const fullImageUrl = item.url?.startsWith('http') ? item.url : `${BACKEND_BASE}${item.url}`;
  const hidden = item.isHidden;

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover="hover"
        className="group relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
            hidden ? 'opacity-60' : ''
          }`}
          variants={cardHover}
        >
          {/* Image Container */}
          <div 
            className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
            onClick={() => setShowModal(true)}
          >
            <motion.img
              src={fullImageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              variants={imageZoom}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
              }}
            />

            {/* Hidden Overlay */}
            {hidden && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            )}

            {/* Hover Overlay with Gradient */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white text-center"
                  >
                    <FiEye size={48} className="mx-auto mb-2 drop-shadow-lg" />
                    <p className="text-lg font-semibold drop-shadow">Click to view</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Badge */}
            {item.category && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 dark:text-white shadow-lg"
              >
                {item.category}
              </motion.div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Owner Info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiUser size={16} />
              <span>{item.owner?.username || 'Anonymous'}</span>
            </div>

            {/* Social Actions */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <SocialActions
                mediaId={item._id}
                initialLikes={item.likes || 0}
                initialComments={item.comments?.length || 0}
              />
            </div>
          </div>

          {/* Edit Button for Owner */}
          {user && user._id === item.owner?._id && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                // Open edit functionality
              }}
            >
              <FiEdit2 size={18} className="text-primary-600 dark:text-primary-400" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {showModal && (
        <ImageModal
          item={item}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default EnhancedMediaCard;