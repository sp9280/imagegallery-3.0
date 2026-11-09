import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import MediaCard from "../components/gallery/MediaCard";
import { ArrowLeftIcon, PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";

const Categories = () => {
  const { category } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMediaByCategory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/media/category/${category}`);
      setMedia(res.data?.data?.items || []);
    } catch (err) {
      setError("Failed to load media for this category");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMediaByCategory();
  }, [fetchMediaByCategory]);

  return (
    <div className="space-y-8 pb-16">
      {/* Category Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#070913] via-[#0e1222] to-[#080b18] text-white p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,245,212,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Back to All Works</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black capitalize bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300">
                  {category} Collection
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  Curated photography and artwork tagged under {category}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-lg">
              {media.length} {media.length === 1 ? "Visual" : "Visuals"} Available
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid or Spinner */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" label={`Loading ${category} collection...`} />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <PhotoIcon className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No media found in {category}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Be the first creator to upload a photo under this category and showcase your vision to the world!
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onUpdate={fetchMediaByCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
