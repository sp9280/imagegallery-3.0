// client/src/components/gallery/MediaCard.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import ImageModal from "./ImageModal";
import { toggleLike, checkLikeStatus } from "../../services/mediaService";
import {
  HeartIcon as HeartOutline,
  ArrowDownTrayIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ShieldExclamationIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const MediaCard = ({ item, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const rawLikes = Array.isArray(item.likes)
    ? item.likes.length
    : typeof item.likes === "number"
    ? item.likes
    : 0;
  const [likesCount, setLikesCount] = useState(rawLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
  const BACKEND_BASE = API_BASE.replace("/api", "");
  const fullImageUrl = item.url?.startsWith("http")
    ? item.url
    : `${BACKEND_BASE}${item.url}`;
  const hidden = item.isHidden;
  const commentCount = item.comments?.length || 0;
  const creatorName =
    item.metadata?.artist ||
    item.userInfo?.username ||
    item.user?.username ||
    item.owner?.username ||
    "Creator";

  useEffect(() => {
    let isMounted = true;
    checkLikeStatus(item._id)
      .then((res) => {
        if (isMounted && res?.isLiked !== undefined) {
          setIsLiked(res.isLiked);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [item._id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Optimistic UI update
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleLike(item._id);
      if (res?.likes !== undefined) {
        setLikesCount(res.likes);
        setIsLiked(res.isLiked);
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      // Revert if error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(fullImageUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download =
        item.originalName || `${item.title || "imagegallery-download"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(fullImageUrl, "_blank");
    }
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-500 cursor-pointer flex flex-col ${
          hidden ? "opacity-60 grayscale" : ""
        }`}
      >
        {/* Media Container */}
        <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-900">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
          )}

          <img
            src={fullImageUrl}
            alt={item.title || "Gallery image"}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageLoaded(true);
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
            }}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Top Floating Badges (Category & Likes) */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
            {item.category && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/40 dark:bg-slate-900/60 backdrop-blur-md text-white border border-white/10 shadow-sm pointer-events-auto">
                {item.category}
              </span>
            )}

            <button
              onClick={handleLike}
              className="ml-auto pointer-events-auto p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5"
              title={isLiked ? "Unlike photo" : "Like photo"}
            >
              {isLiked ? (
                <HeartSolid className="w-4 h-4 text-rose-500" />
              ) : (
                <HeartOutline className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-rose-500" />
              )}
              {likesCount > 0 && (
                <span className="text-xs font-semibold pr-0.5">
                  {likesCount}
                </span>
              )}
            </button>
          </div>

          {/* Hidden Overlay if moderation hidden */}
          {hidden && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
              <ShieldExclamationIcon className="w-8 h-8 text-amber-400 mb-1" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Content Hidden
              </span>
              <span className="text-[10px] text-slate-300">
                Visible only to moderators
              </span>
            </div>
          )}

          {/* Hover Gradient Overlay with Quick Details & Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-3 text-white">
              {/* Creator Pill */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
                  {creatorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {creatorName}
                  </p>
                  <p className="text-[10px] text-slate-300 truncate">
                    {item.title || "Untitled"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all shadow-sm"
                  title="Download Image"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
                <div
                  className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all shadow-sm"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer (Clean title & engagement stats) */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {item.title || "Untitled Media"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              by {creatorName}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-400 text-xs">
            {commentCount > 0 && (
              <span className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                {commentCount}
              </span>
            )}
            <span className="flex items-center gap-1">
              <HeartSolid className={`w-3.5 h-3.5 ${isLiked ? "text-rose-500" : "text-slate-400"}`} />
              {likesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showModal && (
        <ImageModal
          item={item}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default MediaCard;
