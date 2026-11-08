// client/src/components/layout/Sidebar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  HomeIcon,
  CloudArrowUpIcon,
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhotoIcon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const categories = [
    { name: "All Showcase", path: "/?category=all", icon: GlobeAltIcon },
    { name: "Nature & Wildlife", path: "/categories/Nature", icon: PhotoIcon },
    { name: "Architecture", path: "/categories/Architecture", icon: BuildingOffice2Icon },
    { name: "Digital Art & 3D", path: "/categories/Art", icon: PaintBrushIcon },
  ];

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white/95 dark:bg-[#070913]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <PhotoIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Navigation
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ImageGallery 3.0 Platform
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
              Main Menu
            </span>
            <div className="space-y-1">
              <Link
                to="/"
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/")
                    ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-[0_0_20px_rgba(0,245,212,0.25)]"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Explore Showcase</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/upload"
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive("/upload")
                        ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-[0_0_20px_rgba(0,245,212,0.25)]"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Upload Studio</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive("/profile")
                        ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-[0_0_20px_rgba(0,245,212,0.25)]"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>My Works & Portfolio</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
              Curated Collections
            </span>
            <div className="space-y-1">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <CatIcon className="w-5 h-5 text-indigo-500" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin Management (if role is admin) */}
          {user?.role === "admin" && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 px-3 block mb-2">
                Administration
              </span>
              <div className="space-y-1">
                <Link
                  to="/admin"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                >
                  <ShieldCheckIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
                <Link
                  to="/admin/users"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Squares2X2Icon className="w-5 h-5" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/admin/images"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span>Manage Images</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>System Analytics</span>
                </Link>
              </div>
            </div>
          )}

          {/* Pro Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">
              <SparklesIcon className="w-4 h-4" />
              <span>Creator Tip</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload crisp, high-resolution visuals with descriptive tags to get featured in our daily trending showcases!
            </p>
          </div>
        </div>

        {/* User Card at Bottom */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/60">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user.role} Member
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Join our visual creative community.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={toggleSidebar}
                  className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={toggleSidebar}
                  className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
