// Enhanced Header with Modern UI - Professional Design (No Emojis)
import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { toggleTheme, getCurrentTheme } from "../../styles/theme";
import { 
  FiSearch, FiUpload, FiUser, FiSettings, FiMenu, FiX, 
  FiSun, FiMoon, FiImage, FiLogIn, FiShield 
} from "react-icons/fi";
import { 
  HiOutlinePhotograph, HiOutlineUserGroup, HiOutlineLightBulb,
  HiOutlineGlobe, HiOutlineCube, HiOutlineFire, HiOutlineStar
} from "react-icons/hi";

const EnhancedHeader = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setSelectedCategory(params.get("category") || "all");
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) params.set("search", trimmedSearch);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);

    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
    setIsMenuOpen(false);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const params = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) params.set("search", trimmedSearch);
    if (value && value !== "all") params.set("category", value);

    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isHeaderVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-purple-500 p-2.5 rounded-xl shadow-lg floating">
                <FiImage className="text-white" size={24} />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col"
            >
              <h1 className="text-xl md:text-2xl font-black gradient-text neon-text leading-tight">
                ImageGallery
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Professional Platform
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search stunning images..."
                  className="input-creative w-full pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-creative min-w-[180px]"
              >
                <option value="all">All Categories</option>
                <option value="Nature">Nature</option>
                <option value="Architecture">Architecture</option>
                <option value="People">People</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
              </select>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-creative flex items-center gap-2"
                  >
                    <FiUpload size={18} />
                    <span>Upload</span>
                  </motion.button>
                </Link>

                <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 glass-card rounded-xl font-bold flex items-center gap-2 hover-lift"
                  >
                    <FiUser size={18} />
                    <span className="max-w-[100px] truncate">{user.username}</span>
                  </motion.button>
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="badge-creative flex items-center gap-2"
                    >
                      <FiShield size={18} />
                      <span>Admin</span>
                    </motion.button>
                  </Link>
                )}

                <motion.button
                  onClick={handleToggleTheme}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl glass-card hover-lift"
                  title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {currentTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </motion.button>

                <LogoutButton />
              </>
            ) : (
              <>
                <motion.button
                  onClick={handleToggleTheme}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl glass-card hover-lift"
                  title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {currentTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </motion.button>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-creative flex items-center gap-2"
                  >
                    <FiLogIn size={18} />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2.5 rounded-xl glass-card hover-lift"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="space-y-2">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 transition-all outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 transition-all outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Nature">Nature</option>
                    <option value="Architecture">Architecture</option>
                    <option value="People">People</option>
                    <option value="Technology">Technology</option>
                    <option value="Art">Art</option>
                    <option value="Sports">Sports</option>
                    <option value="Food">Food</option>
                  </select>
                </form>

                {/* Mobile Actions */}
                {user ? (
                  <div className="space-y-2">
                    <Link to="/upload" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-xl font-bold text-center shadow-lg">
                      <FiUpload className="inline mr-2" /> Upload Image
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-center">
                      <FiUser className="inline mr-2" /> {user.username}
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-xl font-bold text-center shadow-lg">
                        <FiShield className="inline mr-2" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleToggleTheme(); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      {currentTheme === 'dark' ? (
                        <>
                          <FiSun size={18} />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <FiMoon size={18} />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-xl font-bold text-center shadow-lg">
                      <FiLogIn className="inline mr-2" /> Sign In
                    </Link>
                    <button
                      onClick={() => { handleToggleTheme(); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      {currentTheme === 'dark' ? (
                        <>
                          <FiSun size={18} />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <FiMoon size={18} />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default EnhancedHeader;