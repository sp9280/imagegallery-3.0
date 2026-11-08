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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Back to All Works</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <SparklesIcon className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold capitalize">
                  {category} Collection
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  Curated photography and artwork tagged under {category}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
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
          <Spinner />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Loading {category} works...
          </p>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <PhotoIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No media found in {category}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Be the first creator to upload a photo under this category!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all"
          >
            Upload Media
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
