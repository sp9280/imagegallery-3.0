// client/src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MediaCard from "../components/gallery/MediaCard";
import Spinner from "../components/common/Spinner";
import api from "../services/api";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowRightIcon,
  CameraIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";

const Home = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'masonry'
  const [heroSearch, setHeroSearch] = useState("");
  const [mediumFilter, setMediumFilter] = useState("all"); // 'all', 'optical', 'ai'

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";

  const categories = [
    { label: "All Works", value: "all", emoji: "✨" },
    { label: "Nature & Wildlife", value: "Nature", emoji: "🌿" },
    { label: "Architecture", value: "Architecture", emoji: "🏛️" },
    { label: "Digital Art & 3D", value: "Art", emoji: "🎨" },
    { label: "General", value: "General", emoji: "📸" },
  ];

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get("search")?.trim();
      const categoryFilter = params.get("category");
      const requestParams = {};

      if (searchQuery) requestParams.search = searchQuery;
      if (categoryFilter && categoryFilter !== "all") {
        requestParams.category = categoryFilter;
      }

      const endpoint = user ? "/media/browse" : "/media/public";
      const res = await api.get(endpoint, { params: requestParams });
      setMedia(res.data?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch gallery media:", err);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    setHeroSearch(currentSearch);
  }, [user, location.search]);

  const handleCategorySelect = (catValue) => {
    const params = new URLSearchParams(location.search);
    if (catValue === "all") {
      params.delete("category");
    } else {
      params.set("category", catValue);
    }
    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const trimmed = heroSearch.trim();
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    navigate(`/${query ? `?${query}` : ""}`);
  };

  const clearFilters = () => {
    setMediumFilter("all");
    navigate("/");
  };

  // Filter media by medium type (Optical vs AI)
  const filteredMedia = media.filter((item) => {
    if (mediumFilter === "ai") return item.metadata?.isAiGenerated === true;
    if (mediumFilter === "optical") return item.metadata?.isAiGenerated !== true;
    return true;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* ========================================================
          HERO SECTION (Bespoke Aurora Cyber-Obsidian Look)
      ======================================================== */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#070913] via-[#0e1222] to-[#080b18] text-white p-8 sm:p-14 md:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10">
        {/* Luminous Aurora Ambient Blurs */}
        <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none animate-float" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        
        {/* Subtle Cyber Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#00f5d4_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Holographic Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/15 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,245,212,0.15)] animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5d4]" />
            <span>ImageGallery 3.0 • Intelligent Visual Sanctuary</span>
          </div>

          {/* Majestic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] animate-fade-in-up">
            Where Visual Art{" "}
            <br className="hidden sm:inline" />
            Transcends{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 drop-shadow-sm">
              Perfection.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto font-normal animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A sanctuary for high-resolution photography and generative artwork. Automatically enriched with camera optics, aperture, resolution, and AI classification.
          </p>

          {/* Modern Floating Hero Search */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="pt-2 max-w-2xl mx-auto flex items-center bg-white/5 dark:bg-slate-950/70 backdrop-blur-2xl p-2 rounded-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.4)] focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(0,245,212,0.25)] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="pl-4 text-cyan-400">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search Sony A7, f/1.8, Cyberpunk, 4K, Leica, or prompt keywords..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />
            {heroSearch && (
              <button
                type="button"
                onClick={() => setHeroSearch("")}
                className="p-1 rounded-full text-slate-400 hover:text-white mr-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,245,212,0.3)] transition-all cursor-pointer"
            >
              Explore
            </button>
          </form>

          {/* EXIF DNA Capabilities Pill Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <span className="font-semibold text-slate-400">Auto-Detected DNA:</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              📷 Camera & Lens
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              ⚡ F-Stop Aperture
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              📐 Resolution
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              📍 GPS Location
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              🤖 AI vs Optical
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          DUAL-LAYER FILTER STRIP (Categories & AI/Optical Toggle)
      ======================================================== */}
      <section className="space-y-4">
        {/* Layer 1: Medium Filter (All / Optical Camera / AI Generated) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-fit">
            <button
              onClick={() => setMediumFilter("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mediumFilter === "all"
                  ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ✨ All Mediums
            </button>
            <button
              onClick={() => setMediumFilter("optical")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mediumFilter === "optical"
                  ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CameraIcon className="w-3.5 h-3.5" />
              <span>Optical Photography</span>
            </button>
            <button
              onClick={() => setMediumFilter("ai")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mediumFilter === "ai"
                  ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CpuChipIcon className="w-3.5 h-3.5" />
              <span>AI Generated</span>
            </button>
          </div>

          {/* View Grid Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Showing {filteredMedia.length} {filteredMedia.length === 1 ? "work" : "works"}
            </span>
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "grid"
                    ? "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Grid Layout"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "masonry"
                    ? "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Masonry Layout"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Layer 2: Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected =
              currentCategory === cat.value ||
              (!searchParams.get("category") && cat.value === "all");
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-black/10 dark:shadow-white/10 scale-105"
                    : "bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          MAIN MEDIA GALLERY SHOWCASE
      ======================================================== */}
      <section>
        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center space-y-4">
            <Spinner />
            <p className="text-sm font-semibold text-cyan-400 animate-pulse tracking-wide">
              Loading visual gallery & image DNA...
            </p>
          </div>
        ) : filteredMedia.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl max-w-xl mx-auto space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <PhotoIcon className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                No visual works found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {currentSearch || currentCategory !== "all" || mediumFilter !== "all"
                  ? "No results matched your active filters. Try adjusting the search query or medium type."
                  : "Be the pioneer artist to upload and share a photo with the world!"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Reset All Filters
              </button>
              {user ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  <span>Upload Media</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
                >
                  <span>Sign In to Upload</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Populated Responsive Grid */
          <div
            className={
              viewMode === "masonry"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            }
          >
            {filteredMedia.map((item) => (
              <div key={item._id} className="break-inside-avoid">
                <MediaCard item={item} onUpdate={fetchMedia} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          BOTTOM CREATIVE BANNER
      ======================================================== */}
      {!user && (
        <section className="rounded-[2.5rem] bg-gradient-to-r from-[#0d1022] via-[#14122d] to-[#0d1022] text-white p-8 sm:p-14 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[11px] font-bold text-cyan-300">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Join the Creative Collective</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black">
              Showcase Your Vision to the World
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Publish high-resolution photographs, generative art, and creative renders with intelligent auto-EXIF metadata tracking.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Join ImageGallery Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
