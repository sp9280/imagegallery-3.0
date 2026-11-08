// client/src/components/layout/Sidebar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  HomeIcon,
  CloudArrowUpIcon,
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/categories", label: "Categories", icon: Squares2X2Icon },
  ];

  if (user) {
    menuItems.push({ path: "/upload", label: "Upload", icon: CloudArrowUpIcon });
    menuItems.push({ path: "/profile", label: "Profile", icon: UserCircleIcon });
  }

  const sidebarClasses = `
    fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/80 dark:bg-slate-900/90 
    backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 
    transition-transform duration-300 ease-in-out z-40 w-64 shadow-2xl
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${!isMobile && isOpen ? "md:translate-x-0" : ""} 
    ${!isMobile && !isOpen ? "md:-translate-x-full" : ""}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full p-4">
        {isMobile && (
          <div className="flex justify-end mb-4 md:hidden">
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <XMarkIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        )}

        <div className="mb-8 px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Menu
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive(item.path)
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
              >
                <item.icon className={`w-6 h-6 ${isActive(item.path) ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                <span className="font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-4 py-6 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900 border border-primary-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-white mb-1">
            Pro Tip
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Drag & drop images directly onto the upload page for faster sharing.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
