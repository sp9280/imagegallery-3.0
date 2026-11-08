// client/src/components/layout/Header.js
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { toggleTheme, getCurrentTheme } from "../../styles/theme";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  CloudArrowUpIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800 py-2"
          : "bg-white dark:bg-slate-900 border-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                PixelClub
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <input
                type="text"
                placeholder="Search images..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-focus-within:text-primary-500 transition-colors" />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative overflow-hidden"
              title="Toggle Theme"
            >
              {currentTheme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/upload"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  <span>Upload</span>
                </Link>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {user.username}
                  </span>
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
