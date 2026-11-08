// client/src/pages/Profile.js
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import userService from "../services/userService";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import MediaCard from "../components/gallery/MediaCard";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  GlobeAltIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  PhotoIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userMedia, setUserMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'public', 'private', 'hidden'
  const [adminScopeAll, setAdminScopeAll] = useState(false);

  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    secondaryEmail: "",
    nickname: "",
    yearOfStudy: "",
    stream: "",
  });

  const fetchUserMedia = useCallback(async () => {
    try {
      setLoading(true);
      const url = adminScopeAll ? "/media/user?scope=all" : "/media/user";
      const res = await api.get(url);
      setUserMedia(res.data?.data?.items || []);
    } catch (err) {
      setError("Failed to load your media portfolio");
    } finally {
      setLoading(false);
    }
  }, [adminScopeAll]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserMedia();
    setProfileData({
      phoneNumber: user.phoneNumber || "",
      secondaryEmail: user.secondaryEmail || "",
      nickname: user.nickname || "",
      yearOfStudy: user.yearOfStudy || "",
      stream: user.stream || "",
    });
  }, [user, navigate, fetchUserMedia]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const response = await userService.updateProfile(profileData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      if (setUser && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter media for tabs
  const publicCount = userMedia.filter((m) => m.isPublic !== false).length;
  const privateCount = userMedia.filter((m) => m.isPublic === false).length;
  const hiddenCount = userMedia.filter((m) => m.isHidden).length;

  const displayedMedia = userMedia.filter((item) => {
    if (activeTab === "public") return item.isPublic !== false && !item.isHidden;
    if (activeTab === "private") return item.isPublic === false && !item.isHidden;
    if (activeTab === "hidden") return item.isHidden;
    return true;
  });

  if (loading && userMedia.length === 0) return <Spinner />;

  return (
    <div className="space-y-10 pb-20">
      {/* ========================================================
          CREATOR HERO PROFILE BANNER
      ======================================================== */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#070914] via-[#0e1224] to-[#070914] text-white p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_25px_rgba(0,245,212,0.3)] shrink-0">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user?.username}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 uppercase tracking-wider">
                  {user?.role === "admin" ? "Master Admin" : "Creator"}
                </span>
                {user?.nickname && (
                  <span className="text-xs text-slate-400">"{user.nickname}"</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <EnvelopeIcon className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,245,212,0.25)] transition-all"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Upload New Work</span>
            </Link>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
            >
              <PencilSquareIcon className="w-4 h-4" />
              <span>{isEditing ? "Close Profile Edit" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Live Portfolio Stats Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-white">{userMedia.length}</p>
            <p className="text-xs text-slate-400">Total Uploads</p>
          </div>
          <div>
            <p className="text-2xl font-black text-cyan-400">{publicCount}</p>
            <p className="text-xs text-slate-400">Public Works</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">{privateCount}</p>
            <p className="text-xs text-slate-400">Private Works</p>
          </div>
          <div>
            <p className="text-2xl font-black text-purple-400">
              {userMedia.reduce((sum, m) => sum + (Array.isArray(m.likes) ? m.likes.length : (typeof m.likes === 'number' ? m.likes : 0)), 0)}
            </p>
            <p className="text-xs text-slate-400">Total Likes Received</p>
          </div>
        </div>
      </div>

      {error && <Alert message={error} type="error" onClose={() => setError("")} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}

      {/* ========================================================
          EDIT PROFILE FORM (Collapsible)
      ======================================================== */}
      {isEditing && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PencilSquareIcon className="w-5 h-5 text-cyan-400" />
            <span>Update Creator Profile</span>
          </h2>

          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Nickname / Pen Name</label>
              <input
                type="text"
                value={profileData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="e.g. VisualPoet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Phone Number</label>
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Secondary Email</label>
              <input
                type="email"
                value={profileData.secondaryEmail}
                onChange={(e) => handleInputChange("secondaryEmail", e.target.value)}
                placeholder="backup@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Creative Domain / Major</label>
              <input
                type="text"
                value={profileData.stream}
                onChange={(e) => handleInputChange("stream", e.target.value)}
                placeholder="e.g. Fine Arts, Photography, 3D"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Experience / Level</label>
              <select
                value={profileData.yearOfStudy}
                onChange={(e) => handleInputChange("yearOfStudy", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner Photographer</option>
                <option value="Enthusiast">Enthusiast / Hobbyist</option>
                <option value="Professional">Professional Artist</option>
                <option value="Studio">Studio Agency</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Save Profile Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          UPLOADED WORKS PORTFOLIO (Public & Private Works)
      ======================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PhotoIcon className="w-6 h-6 text-cyan-400" />
              <span>Uploaded Portfolio Works</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage all your creations including both private and public uploads.
            </p>
          </div>

          {/* Master Admin Scope Toggle */}
          {user?.role === "admin" && (
            <button
              onClick={() => setAdminScopeAll(!adminScopeAll)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminScopeAll
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <ShieldCheckIcon className="w-4 h-4 text-amber-400" />
              <span>{adminScopeAll ? "👑 Viewing All Platform Media (Admin)" : "View All Platform Media"}</span>
            </button>
          )}
        </div>

        {/* Portfolio Tabs (All, Public, Private, Hidden) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10"
            }`}
          >
            All Works ({userMedia.length})
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "public"
                ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10"
            }`}
          >
            <GlobeAltIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public ({publicCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "private"
                ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10"
            }`}
          >
            <LockClosedIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Private ({privateCount})</span>
          </button>
          {hiddenCount > 0 && (
            <button
              onClick={() => setActiveTab("hidden")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "hidden"
                  ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10"
              }`}
            >
              <EyeSlashIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>Hidden ({hiddenCount})</span>
            </button>
          )}
        </div>

        {/* Media Grid */}
        {displayedMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedMedia.map((item) => (
              <div key={item._id} className="relative group">
                <MediaCard item={item} onUpdate={fetchUserMedia} />
                {/* Visual Privacy Tag over card */}
                <div className="absolute top-2.5 left-2.5 z-30 pointer-events-none">
                  {item.isPublic === false ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 backdrop-blur-md text-slate-950 shadow-md flex items-center gap-1">
                      <LockClosedIcon className="w-3 h-3" />
                      <span>Private</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 backdrop-blur-md text-slate-950 shadow-md flex items-center gap-1">
                      <GlobeAltIcon className="w-3 h-3" />
                      <span>Public</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <PhotoIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {activeTab === "private"
                ? "No private uploads found"
                : activeTab === "public"
                ? "No public uploads found"
                : "No uploaded works yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready to showcase your photography and generative art? Upload your first masterpiece now.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Upload Work</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
