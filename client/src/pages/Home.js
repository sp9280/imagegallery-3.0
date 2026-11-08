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
  FireIcon
} from "@heroicons/react/24/outline";

const Home = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'masonry'
  const [heroSearch, setHeroSearch] = useState("");

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
    navigate("/");
  };

  return (
    <div className="space-y-12 pb-16">
      {/* ========================================================
          HERO SECTION (High-Impact Modern Visual Presentation)
      ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-indigo-500/20">
        {/* Ambient Decorative Glow Lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Discover ImageGallery 3.0 • The Creative Sanctuary</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Where Imagination Meets{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Visual Perfection
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Explore millions of curated high-resolution photographs, 3D renders, and digital art created by passionate creators around the globe.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="pt-2 max-w-xl mx-auto flex items-center bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all"
          >
            <div className="pl-3 text-slate-300">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search high-res photos, themes, keywords..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {heroSearch && (
              <button
                type="button"
                onClick={() => setHeroSearch("")}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all"
            >
              Search
            </button>
          </form>

          {/* Live Platform Stats */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-center">
            <div>
              <p className="text-2xl font-black text-white">10K+</p>
              <p className="text-xs text-indigo-200">Curated Assets</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">45K+</p>
              <p className="text-xs text-indigo-200">Global Artists</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-indigo-200">Free Downloads</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">4K UHD</p>
              <p className="text-xs text-indigo-200">Original Resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FILTER & CATEGORY SELECTION BAR
      ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected =
                currentCategory === cat.value ||
                (!searchParams.get("category") && cat.value === "all");
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Active Status */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Active search tag */}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <span>"{currentSearch}"</span>
                <button
                  onClick={clearFilters}
                  className="hover:text-rose-500"
                  title="Clear search"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* View Grid Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "masonry"
                    ? "bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Masonry View"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MEDIA GALLERY GRID
      ======================================================== */}
      <section>
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Spinner />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
              Curating stunning visuals for you...
            </p>
          </div>
        ) : media.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <PhotoIcon className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                No visual works found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {currentSearch || currentCategory !== "all"
                  ? "We couldn't find any media matching your current filters. Try searching for something else or clearing filters."
                  : "Be the very first creator to share a stunning photograph or digital masterpiece with the community!"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {(currentSearch || currentCategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
              {user ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  <span>Upload Media</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all"
                >
                  <span>Sign In to Upload</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Populated Media Grid */
          <div
            className={
              viewMode === "masonry"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            }
          >
            {media.map((item) => (
              <div key={item._id} className="break-inside-avoid">
                <MediaCard item={item} onUpdate={fetchMedia} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          BOTTOM CALL TO ACTION (For Guests)
      ======================================================== */}
      {!user && (
        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to Share Your Masterpieces?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
              Join thousands of creators showcasing their photography, artwork, and visual stories. It takes only a minute to get started.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-indigo-700 text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
