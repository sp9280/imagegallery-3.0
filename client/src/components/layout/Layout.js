// client/src/components/layout/Layout.js
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060811] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient background glow orbs */}
      <div className="fixed top-0 left-1/4 w-[36rem] h-[36rem] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[36rem] h-[36rem] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[36rem] h-[36rem] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main sticky navigation */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Slide-out sidebar drawer */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Modern Global Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
