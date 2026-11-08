// client/src/components/layout/Header.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { toggleTheme, getCurrentTheme } from "../../styles/theme";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setIsMobileMenuOpen(false);
  }, [location.search, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchTerm.trim();
    if (trimmed) params.set("search", trimmed);
    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(location.search);
    params.delete("search");
    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/85 dark:bg-[#070913]/90 backdrop-blur-2xl border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
          : "bg-white/95 dark:bg-[#070913]/95 backdrop-blur-xl border-slate-200/50 dark:border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Left: Sidebar Toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
              title="Toggle sidebar drawer"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all">
                <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-cyan-200 dark:to-pink-300 tracking-tight">
                  ImageGallery
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-black rounded-md bg-cyan-400/10 text-cyan-500 dark:text-cyan-400 border border-cyan-400/30">
                  3.0
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search optics, aperture, resolution, tags... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-24 py-2 sm:py-2.5 text-sm rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#070913] border border-transparent focus:border-cyan-400/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10">
                  ⌘K
                </kbd>
              </div>
            </form>
          </div>

          {/* Right Navigation & User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                location.pathname === "/"
                  ? "text-cyan-400 bg-cyan-400/10 border border-cyan-400/20"
                  : "text-slate-600 dark:text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              <span>Showcase</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                title="Admin Panel"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all focus:outline-none"
              title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle Theme"
            >
              {currentTheme === "dark" ? (
                <SunIcon className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <MoonIcon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/upload"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,245,212,0.25)] hover:shadow-[0_0_30px_rgba(0,245,212,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block mx-0.5" />

                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  title="My Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden xl:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.username}
                  </span>
                </Link>

                <div className="hidden sm:block">
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,245,212,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 md:hidden"
              aria-label="Toggle search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-slate-200/60 dark:border-white/10 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search optics, cameras, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
