// client/src/components/gallery/Gallery.js
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import MediaCard from "./MediaCard";
import Spinner from "../common/Spinner";
import api from "../../services/api";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search")?.trim();
        const categoryFilter = params.get("category");
        const requestParams = {};

        if (searchQuery) {
          requestParams.search = searchQuery;
        }

        if (categoryFilter && categoryFilter !== "all") {
          requestParams.category = categoryFilter;
        }

        const endpoint = user ? "/media/browse" : "/media/public";
        const res = await api.get(endpoint, { params: requestParams });
        setMedia(res.data?.data?.items || []);
      } catch (err) {
        console.error("Failed to load media:", err);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [user, location.search]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Spinner />
    </div>
  );

  return (
    <div className="container mx-auto pb-12">
      {/* Welcome Hero Section for Public Users */}
      {!user && media.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white p-8 md:p-12 mb-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Share Your World <br />
              <span className="text-primary-200">Through Pixels</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg">
              Join our creative community to share photos, discover inspiration, and connect with other artists.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/20"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-primary-700/50 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-primary-700/70 transition-colors border border-white/20"
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <div className="absolute inset-0 bg-mesh mix-blend-overlay"></div>
          </div>
        </div>
      )}

      {user && media.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhotoIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No media found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            It looks like there's nothing here yet. Why not upload your first masterpiece?
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <MediaCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
