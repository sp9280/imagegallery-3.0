import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="relative max-w-2xl w-full text-center space-y-8">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* 404 Giant Number */}
        <div className="relative z-10">
          <h1 className="text-[8rem] sm:text-[12rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 drop-shadow-2xl animate-fade-in-up select-none">
            404
          </h1>
        </div>

        {/* Glitch Line */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Lost in the Visual Void
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
            This Page Vanished into the Gallery
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you're searching for may have been moved, hidden, or never existed in this visual sanctuary. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white text-sm font-bold shadow-[0_0_25px_rgba(0,245,212,0.25)] hover:-translate-y-0.5 transition-all"
          >
            <HomeIcon className="w-4 h-4" />
            Back to Gallery
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Decorative floating icon */}
        <div className="relative z-10 pt-8 flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center animate-float">
            <PhotoIcon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
