// client/src/components/gallery/ImageModal.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comments from "./Comments";
import HideReasonModal from "./HideReasonModal";
import mediaService from "../../services/mediaService";
import {
  XMarkIcon,
  HeartIcon as HeartOutline,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  CameraIcon,
  CpuChipIcon,
  MapPinIcon,
  CalendarDaysIcon,
  EyeIcon,
  TrashIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const ImageModal = ({ item, onClose, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const rawLikes = Array.isArray(item.likes)
    ? item.likes.length
    : typeof item.likes === "number"
    ? item.likes
    : 0;
  const [likes, setLikes] = useState(rawLikes);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showHideReasonModal, setShowHideReasonModal] = useState(false);
  const [comments, setComments] = useState(item.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentName, setNewCommentName] = useState("");

  const [editedDetails, setEditedDetails] = useState({
    title: item.title || "",
    description: item.description || "",
    isPublic: item.isPublic !== false,
    photographer: item.metadata?.artist || "",
    location: item.metadata?.locationText || "",
    camera: item.metadata?.cameraModel || "",
    resolution: item.metadata?.resolution || "",
  });

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
  const BACKEND_BASE = API_BASE.replace("/api", "");
  const fullImageUrl = item.url?.startsWith("http")
    ? item.url
    : `${BACKEND_BASE}${item.url}`;

  const isOwner = user && (user._id === item.user?._id || user._id === item.user || user.id === item.user);
  const isAdmin = user && user.role === "admin";
  const canModerate = isOwner || isAdmin;

  const metadata = item.metadata || {};
  const photographer = metadata.artist || item.userInfo?.username || item.user?.username || "Artist";
  const captureDate = metadata.captureDate ? new Date(metadata.captureDate) : null;
  const locationText = metadata.locationText || (metadata.location
    ? `${metadata.location.latitude?.toFixed(4)}°, ${metadata.location.longitude?.toFixed(4)}°`
    : null);
  const resolution = metadata.resolution;

  useEffect(() => {
    let isMounted = true;
    mediaService.checkLikeStatus(item._id)
      .then((res) => {
        if (isMounted && res?.isLiked !== undefined) {
          setLiked(res.isLiked);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [item._id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      const prevLiked = liked;
      const prevCount = likes;
      setLiked(!prevLiked);
      setLikes(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

      const response = await mediaService.toggleLike(item._id);
      const newLikes = response?.likes ?? response?.data?.likes;
      const newIsLiked = response?.isLiked ?? response?.data?.isLiked;
      if (newLikes !== undefined) {
        setLikes(newLikes);
      }
      if (newIsLiked !== undefined) {
        setLiked(newIsLiked);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to like media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(fullImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = item.originalName || `${item.title || "imagegallery"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      await mediaService.trackDownload(item._id).catch(() => {});
    } catch (error) {
      window.open(fullImageUrl, "_blank");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canModerate) return;
    if (!window.confirm("Are you sure you want to delete this media? This action cannot be undone.")) return;
    try {
      await mediaService.deleteMedia(item._id);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      alert("Failed to delete media");
    }
  };

  const handleHideConfirm = async (hideSettings) => {
    if (!canModerate) return;
    try {
      await mediaService.toggleHide(item._id, hideSettings);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      alert("Failed to update visibility");
    }
  };

  const handleSaveDetails = async () => {
    if (!canModerate) return;
    try {
      const updates = {
        title: editedDetails.title,
        description: editedDetails.description,
        isPublic: editedDetails.isPublic,
        metadata: {
          ...metadata,
          artist: editedDetails.photographer || undefined,
          locationText: editedDetails.location || undefined,
          cameraModel: editedDetails.camera || undefined,
          resolution: editedDetails.resolution || undefined,
        },
      };
      await mediaService.editMedia(item._id, updates);
      if (onUpdate) onUpdate();
      setIsEditingDetails(false);
    } catch (error) {
      alert("Failed to update details");
    }
  };

  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const name = user ? user.username : (newCommentName.trim() || "Guest");
      await mediaService.addComment(item._id, {
        text: newCommentText.trim(),
        name,
        email: user?.email || "guest@example.com",
      });

      const newComment = {
        text: newCommentText.trim(),
        username: name,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setNewCommentText("");
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl h-[94vh] max-h-[920px] bg-[#070914] text-white rounded-[2rem] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================
            LEFT HAND SIDE: THE IMAGE DISPLAY (Viewport ~60-65%)
        ======================================================== */}
        <div className="w-full md:w-[60%] lg:w-[65%] h-[45vh] md:h-full bg-black/70 flex items-center justify-center relative p-4 sm:p-8 select-none overflow-hidden">
          {/* Ambient Image Glow Background */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${fullImageUrl})` }}
          />

          {/* High-Resolution Picture */}
          <img
            src={fullImageUrl}
            alt={item.title || "Gallery photo"}
            className="relative z-10 max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Top Floating Left Badges on Picture */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
            {metadata.isAiGenerated ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/40 shadow-lg">
                <CpuChipIcon className="w-4 h-4 text-pink-400" />
                <span>{metadata.aiModel || "AI Generated"}</span>
              </span>
            ) : metadata.cameraModel ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/40 shadow-lg">
                <CameraIcon className="w-4 h-4 text-cyan-400" />
                <span>{metadata.cameraModel}</span>
              </span>
            ) : null}

            {resolution && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                {resolution}
              </span>
            )}
          </div>

          {/* Bottom Floating Controls on Picture */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] text-white/75 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {item.isPublic !== false ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <GlobeAltIcon className="w-3.5 h-3.5" /> Public Work
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400">
                  <LockClosedIcon className="w-3.5 h-3.5" /> Private Work
                </span>
              )}
            </span>

            <div className="flex items-center gap-2 pointer-events-auto">
              <a
                href={fullImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-900/80 hover:bg-white hover:text-black text-white backdrop-blur-md border border-white/10 transition-all shadow-lg"
                title="Open original high-res image"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-slate-950 font-bold backdrop-blur-md transition-all shadow-lg"
                title="Download Photo"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT HAND SIDE: THE DETAILS INSPECTOR (~35-40%)
        ======================================================== */}
        <div className="w-full md:w-[40%] lg:w-[35%] h-[49vh] md:h-full flex flex-col bg-[#0b0e1e] border-t md:border-t-0 md:border-l border-white/10 overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            {/* Creator Pill */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                {photographer.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {photographer}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Uploaded {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close (ESC)"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Details Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 uppercase tracking-wider">
                  #{item.category}
                </span>
                {item.license && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-400 border border-white/10">
                    {item.license}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {item.title}
              </h2>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 text-slate-300 border border-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* ========================================================
                SHOT DETAILS / IMAGE DNA (Camera, F-Stop, Focus, Date, AI)
            ======================================================== */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <CameraIcon className="w-4 h-4" />
                  <span>Technical Shot Details</span>
                </span>
                {metadata.isAiGenerated ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    AI Generated
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Optical Capture
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {metadata.cameraModel && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Camera</span>
                    <span className="font-bold text-white truncate block">{metadata.cameraModel}</span>
                  </div>
                )}
                {metadata.cameraType && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Camera Type</span>
                    <span className="font-bold text-white truncate block">{metadata.cameraType}</span>
                  </div>
                )}
                {metadata.aperture && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Aperture</span>
                    <span className="font-bold text-cyan-300">f/{metadata.aperture}</span>
                  </div>
                )}
                {metadata.focalLength && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Focal Length</span>
                    <span className="font-bold text-white">{metadata.focalLength}mm</span>
                  </div>
                )}
                {resolution && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Resolution</span>
                    <span className="font-bold text-white">{resolution}</span>
                  </div>
                )}
                {captureDate && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Captured Date</span>
                    <span className="font-bold text-white truncate block">
                      {captureDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {locationText && (
                  <div className="col-span-2 bg-white/5 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block font-semibold">Location / GPS</span>
                      <span className="font-bold text-white truncate block">{locationText}</span>
                    </div>
                  </div>
                )}
                {metadata.aiModel && (
                  <div className="col-span-2 bg-pink-950/20 p-2.5 rounded-xl border border-pink-500/30 flex items-center gap-2">
                    <CpuChipIcon className="w-4 h-4 text-pink-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-pink-300 block font-semibold">AI Generator Engine</span>
                      <span className="font-bold text-white">{metadata.aiModel}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Moderation Actions (Owner or Admin) */}
            {canModerate && (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    {isAdmin && !isOwner ? "Admin Moderation Controls" : "Creator & Moderation Controls"}
                  </span>
                  <button
                    onClick={() => setIsEditingDetails(!isEditingDetails)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEditingDetails ? "Close Editor" : "Edit Details"}</span>
                  </button>
                </div>

                {/* Inline Metadata & Privacy Editor */}
                {isEditingDetails && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editedDetails.title}
                        onChange={(e) => setEditedDetails({ ...editedDetails, title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editedDetails.description}
                        onChange={(e) => setEditedDetails({ ...editedDetails, description: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    {/* Privacy Toggle (Can make image private or public) */}
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-white">Visibility Mode</span>
                        <span className="text-[10px] text-slate-400">
                          {editedDetails.isPublic ? "Public (Visible in feed)" : "Private (Only accessible to uploader)"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditedDetails({ ...editedDetails, isPublic: !editedDetails.isPublic })}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          editedDetails.isPublic
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {editedDetails.isPublic ? "Public" : "Private"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Artist / Credit</label>
                        <input
                          type="text"
                          value={editedDetails.photographer}
                          onChange={(e) => setEditedDetails({ ...editedDetails, photographer: e.target.value })}
                          className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Camera</label>
                        <input
                          type="text"
                          value={editedDetails.camera}
                          onChange={(e) => setEditedDetails({ ...editedDetails, camera: e.target.value })}
                          className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveDetails}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 transition-all text-xs"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingDetails(false)}
                        className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowHideReasonModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
                  >
                    <EyeSlashIcon className="w-3.5 h-3.5" />
                    <span>{item.isHidden ? "Unhide Photo" : "Hide Photo"}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-xs font-semibold text-rose-300 border border-rose-500/30 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Delete Media</span>
                  </button>
                </div>
              </div>
            )}

            {/* Community Comments Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ChatBubbleLeftIcon className="w-4 h-4 text-cyan-400" />
                  <span>Comments ({comments.length})</span>
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddCommentSubmit} className="space-y-2">
                {!user && (
                  <input
                    type="text"
                    placeholder="Your name..."
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an appreciative thought or technique question..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-300">{c.username || c.name || "Community Member"}</span>
                        <div className="flex items-center gap-2">
                          {isAdmin && (c.ipAddress || c.deviceId || c.macAddress) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                              {c.ipAddress ? `IP: ${c.ipAddress}` : ''}
                              {c.macAddress || c.deviceId ? ` | Dev: ${(c.macAddress || c.deviceId).slice(0, 10)}...` : ''}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-200">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070914] flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              {liked ? (
                <HeartSolid className="w-5 h-5 text-rose-500" />
              ) : (
                <HeartOutline className="w-5 h-5 text-slate-400 hover:text-rose-500" />
              )}
              <span className="text-xs font-bold">{likes} {likes === 1 ? "Like" : "Likes"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,245,212,0.25)] transition-all cursor-pointer"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download High-Res</span>
            </button>
          </div>
        </div>
      </div>

      {showHideReasonModal && (
        <HideReasonModal
          item={item}
          onClose={() => setShowHideReasonModal(false)}
          onConfirm={handleHideConfirm}
        />
      )}
    </div>
  );
};

export default ImageModal;
