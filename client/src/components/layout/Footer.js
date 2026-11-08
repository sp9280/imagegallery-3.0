// client/src/components/layout/Footer.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PhotoIcon,
  HeartIcon,
  SparklesIcon,
  CheckCircleIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-white dark:bg-[#060810] border-t border-slate-200 dark:border-white/10 transition-colors duration-300 overflow-hidden">
      {/* Top Accent Gradient Border */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_15px_rgba(0,245,212,0.5)]" />

      {/* Ambient background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <PhotoIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-300 to-pink-400">
                  ImageGallery 3.0
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Next-Gen Creative Visuals
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              An intelligent, high-resolution visual sanctuary with automated EXIF DNA detection, camera optics, and generative AI classification.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Join our visual showcase bulletin
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@domain.com"
                  required
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Join</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> Subscribed successfully! Welcome to the collective.
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Featured Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories/Nature" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Nature & Wildlife
                </Link>
              </li>
              <li>
                <Link to="/categories/Architecture" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Architecture & Urban
                </Link>
              </li>
              <li>
                <Link to="/categories/Art" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Digital Art & 3D
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                  <SparklesIcon className="w-3.5 h-3.5" /> Studio Upload
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Collective
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://github.com/sp9280/imagegallery-3.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  GitHub Source
                </a>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Artist Portfolio
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  Discord Creative Guild
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Legal & Rights
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-[11px]">
                  CC BY 4.0 & Public Domain Licenses
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} ImageGallery 3.0. Crafted with</span>
            <HeartIcon className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>for photographers and generative artists worldwide.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 font-bold text-[11px] border border-cyan-400/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5d4]" />
              Image DNA Auto-Pipeline Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
