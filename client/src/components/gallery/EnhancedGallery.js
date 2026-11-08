// Enhanced Gallery with Masonry Layout, Infinite Scroll, and Stunning Animations
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import { AuthContext } from '../../context/AuthContext';
import EnhancedMediaCard from './EnhancedMediaCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import { showToast } from '../common/Toast';
import api from '../../services/api';
import { FiUpload, FiFilter, FiGrid, FiList } from 'react-icons/fi';

const EnhancedGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'grid'
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  useEffect(() => {
    fetchMedia(true);
  }, [user, location.search]);

  const fetchMedia = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get('search')?.trim();
      const categoryFilter = params.get('category');
      
      const requestParams = {
        page: currentPage,
        limit: 12
      };

      if (searchQuery) requestParams.search = searchQuery;
      if (categoryFilter && categoryFilter !== 'all') requestParams.category = categoryFilter;

      const endpoint = user ? '/media/browse' : '/media/public';
      const res = await api.get(endpoint, { params: requestParams });
      
      const newMedia = res.data?.data?.items || [];
      
      if (reset) {
        setMedia(newMedia);
        setPage(2);
      } else {
        setMedia(prev => [...prev, ...newMedia]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newMedia.length === 12);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load media:', err);
      showToast.error('Failed to load images');
      setLoading(false);
    }
  };

  if (loading && media.length === 0) {
    return (
      <div className="gallery-container">
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block floating">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-400 rounded-full blur-2xl opacity-30"
            />
            <h1 className="relative text-5xl md:text-7xl font-black gradient-text neon-text pb-2">
              {user ? `Welcome, ${user.username}!` : 'ImageGallery 3.0'}
            </h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 mt-4 mb-8 max-w-2xl mx-auto"
          >
            {user 
              ? 'Explore stunning visuals and share your creativity'
              : 'Discover amazing photos and videos from our community'
            }
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            {user ? (
              <motion.button
                onClick={() => navigate('/upload')}
                className="btn-creative flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUpload size={24} />
                Upload New Media
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className="btn-creative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login to Upload & More
              </motion.button>
            )}

            {/* View Mode Toggle */}
            <div className="flex glass-card p-2 gap-2">
              <button
                onClick={() => setViewMode('masonry')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 hover-lift ${
                  viewMode === 'masonry'
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50'
                }`}
              >
                <FiFilter /> Masonry
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 hover-lift ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50'
                }`}
              >
                <FiGrid /> Grid
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Gallery */}
        {media.length > 0 ? (
          <InfiniteScroll
            dataLength={media.length}
            next={() => fetchMedia(false)}
            hasMore={hasMore}
            loader={
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading more...</p>
              </div>
            }
            endMessage={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                  You've seen it all!
                </p>
              </motion.div>
            }
          >
            {viewMode === 'masonry' ? (
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
              >
                {media.map((item, index) => (
                  <div key={item._id} className="mb-6">
                    <EnhancedMediaCard item={item} index={index} />
                  </div>
                ))}
              </Masonry>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {media.map((item, index) => (
                  <EnhancedMediaCard key={item._id} item={item} index={index} />
                ))}
              </motion.div>
            )}
          </InfiniteScroll>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-9xl mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-36 h-36 mx-auto text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              No images yet
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {user ? "Be the first to upload!" : "Check back soon for amazing content!"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGallery;