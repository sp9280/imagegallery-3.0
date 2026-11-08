// client/src/components/gallery/MediaCard.js
import React, { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import { toggleLike, checkLikeStatus } from "../../services/mediaService";
import {
  HeartIcon as HeartOutline,
  ArrowDownTrayIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  CameraIcon,
  CpuChipIcon,
  MapPinIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const MediaCard = ({ item, onUpdate }) => {
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

  const metadata = item.metadata || {};
  const creatorName =
    metadata.artist ||
    item.userInfo?.username ||
    item.user?.username ||
    item.owner?.username ||
    "Creator";

  const cameraDisplay =
    metadata.cameraModel ||
    metadata.cameraMake ||
    (metadata.cameraType ? `${metadata.cameraType}` : null);

  const apertureDisplay = metadata.aperture ? `f/${metadata.aperture}` : null;
  const focusDisplay = metadata.focalLength ? `${metadata.focalLength}mm` : null;
  const captureDateDisplay = metadata.captureDate
    ? new Date(metadata.captureDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

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
        className={`group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-[0_0_35px_rgba(0,245,212,0.18)] hover:border-cyan-400/50 dark:hover:border-cyan-400/50 transition-all duration-500 cursor-pointer flex flex-col ${
          hidden ? "opacity-50 grayscale" : ""
        }`}
      >
        {/* Media Container */}
        <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-950">
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

          {/* Top Floating Pill Badges */}
          <div className="absolute top-3 inset-x-3 flex items-start justify-between z-10 pointer-events-none gap-2">
            {/* AI Generated Badge OR Camera Badge */}
            <div className="flex flex-col gap-1.5 pointer-events-auto">
              {metadata.isAiGenerated ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/40 shadow-lg">
                  <CpuChipIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>{metadata.aiModel || "AI Generated"}</span>
                </span>
              ) : cameraDisplay ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30 shadow-lg">
                  <CameraIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[130px]">{cameraDisplay}</span>
                  {apertureDisplay && <span className="opacity-75">{apertureDisplay}</span>}
                </span>
              ) : item.category ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/70 backdrop-blur-md text-white border border-white/10 shadow-sm">
                  {item.category}
                </span>
              ) : null}

              {/* Resolution pill */}
              {metadata.resolution && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 backdrop-blur-md text-slate-300 border border-white/5 w-fit">
                  {metadata.resolution}
                </span>
              )}
            </div>

            {/* Like Heart Button */}
            <button
              onClick={handleLike}
              className="pointer-events-auto p-2 rounded-full bg-white/80 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-md hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5 border border-white/10"
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? (
                <HeartSolid className="w-4 h-4 text-rose-500" />
              ) : (
                <HeartOutline className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-rose-500" />
              )}
              {likesCount > 0 && (
                <span className="text-xs font-bold pr-0.5">{likesCount}</span>
              )}
            </button>
          </div>

          {/* Hover Overlay with Quick Actions & Shot DNA */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
            {/* Metadata Pills on Hover */}
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-wrap gap-1.5 mb-2.5">
              {metadata.locationText && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] text-white">
                  <MapPinIcon className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[120px]">{metadata.locationText}</span>
                </span>
              )}
              {captureDateDisplay && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] text-white">
                  <CalendarDaysIcon className="w-3 h-3 text-purple-400" />
                  <span>{captureDateDisplay}</span>
                </span>
              )}
              {focusDisplay && (
                <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] text-white">
                  {focusDisplay}
                </span>
              )}
            </div>

            {/* Bottom creator & actions row */}
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md">
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

              <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-white/20 hover:bg-cyan-400 hover:text-black text-white backdrop-blur-md transition-all shadow-sm"
                  title="Download Image"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
                <div
                  className="p-2 rounded-full bg-white/20 hover:bg-white hover:text-slate-900 text-white backdrop-blur-md transition-all shadow-sm"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
              {item.title || "Untitled Media"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {creatorName}
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
              <HeartSolid
                className={`w-3.5 h-3.5 ${isLiked ? "text-rose-500" : "text-slate-400"}`}
              />
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
