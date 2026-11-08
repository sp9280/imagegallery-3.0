import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import Alert from "../common/Alert";
import {
  FiImage, FiSearch, FiFilter, FiTrash2, FiEdit2, FiEye, FiEyeOff,
  FiLock, FiGlobe, FiHeart, FiMessageSquare, FiDownload, FiCheck, FiX,
  FiExternalLink, FiRefreshCw
} from "react-icons/fi";

const ManageImages = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  
  // Edit modal state
  const [editingMedia, setEditingMedia] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "General",
    tags: "",
    isPublic: true
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/media?limit=100");
      const items = res.data?.data?.media || res.data?.data?.items || res.data?.data || [];
      setMediaList(Array.isArray(items) ? items : []);
    } catch (err) {
      setError("Failed to load media collection");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivacy = async (item) => {
    try {
      const isSelfUploaded = currentUser && (
        item.user === currentUser.id ||
        item.user === currentUser._id ||
        item.user?._id === currentUser.id ||
        item.user?._id === currentUser._id
      );

      // If user made image private and it's NOT self-uploaded by admin, admin cannot modify it
      if (!item.isPublic && !item.adminLocked && !isSelfUploaded) {
        setError("This image was made private by the user. Administrators can only view it and cannot modify its visibility.");
        return;
      }

      if (item.isPublic) {
        // Hiding public image -> if it's admin moderating someone else's image, it sets adminLock
        await api.put(`/media/${item._id}/hide`, {
          hideLevel: 'hard_hide',
          reason: isSelfUploaded ? 'Set to private by uploader' : 'Hidden by administrator'
        });
        setMediaList(prev => prev.map(m => m._id === item._id ? { ...m, isPublic: false, isHidden: true, adminLocked: !isSelfUploaded } : m));
        setSuccess(isSelfUploaded ? "Your image is now Private." : "Image hidden from public. (User requires admin unlock permission to restore)");
      } else {
        // Unhiding / restoring to public
        if (item.adminLocked) {
          await api.post(`/media/${item._id}/resolve-unlock`, { action: 'approve' });
        } else {
          await api.put(`/media/${item._id}/edit`, { isPublic: true });
        }
        setMediaList(prev => prev.map(m => m._id === item._id ? { ...m, isPublic: true, isHidden: false, adminLocked: false, unlockRequested: false } : m));
        setSuccess("Image unhidden and restored to public view.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update image visibility");
    }
  };

  const handleDeleteMedia = async (mediaId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this image'}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/media/${mediaId}`);
      setMediaList(prev => prev.filter(m => m._id !== mediaId));
      setSuccess("Image deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete image");
    }
  };

  const openEditModal = (item) => {
    const isSelfUploaded = currentUser && (
      item.user === currentUser.id ||
      item.user === currentUser._id ||
      item.user?._id === currentUser.id ||
      item.user?._id === currentUser._id
    );

    if (!item.isPublic && !item.adminLocked && !isSelfUploaded) {
      setError("This image was made private by the user. Administrators can only view it and cannot edit its details.");
      return;
    }
    setEditingMedia(item);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "General",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
      isPublic: item.isPublic !== undefined ? item.isPublic : true
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingMedia) return;
    try {
      setSavingEdit(true);
      const res = await api.put(`/media/${editingMedia._id}/edit`, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        tags: editForm.tags,
        isPublic: editForm.isPublic
      });
      const updated = res.data?.data?.media || { ...editingMedia, ...editForm };
      setMediaList(prev => prev.map(m => m._id === editingMedia._id ? { ...m, ...updated } : m));
      setSuccess("Image details updated successfully");
      setEditingMedia(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save edits");
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter images
  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = !search || 
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesVisibility = visibilityFilter === "all" || 
      (visibilityFilter === "public" && item.isPublic) ||
      (visibilityFilter === "private" && !item.isPublic);

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const categories = ["all", "General", "Nature", "Architecture", "People", "Technology", "Art", "Sports", "Food"];

  if (loading) return <Spinner />;

  return (
    <div className="manage-images px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg">
            <FiImage className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Manage Images
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredMedia.length} of {mediaList.length} total media items
            </p>
          </div>
        </div>

        <button
          onClick={fetchMedia}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all shadow-sm"
        >
          <FiRefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Alerts */}
      {error && <Alert message={error} type="error" onClose={() => setError("")} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 hidden sm:block" size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Filter */}
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>
        </div>
      </motion.div>

      {/* Images Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Image</th>
                <th className="px-6 py-4 text-left font-bold">Details</th>
                <th className="px-6 py-4 text-left font-bold">Uploader</th>
                <th className="px-6 py-4 text-left font-bold">Status</th>
                <th className="px-6 py-4 text-center font-bold">Stats</th>
                <th className="px-6 py-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item, index) => {
                const isSelfUploaded = currentUser && (
                  item.user === currentUser.id ||
                  item.user === currentUser._id ||
                  item.user?._id === currentUser.id ||
                  item.user?._id === currentUser._id
                );
                const isUserPrivateDisabled = !item.isPublic && !item.adminLocked && !isSelfUploaded;
                const uploaderName = item.user?.username || (item.user && typeof item.user === 'object' ? item.user.username : 'User');
                const likesCount = Array.isArray(item.likes) ? item.likes.length : (typeof item.likes === 'number' ? item.likes : 0);
                const commentsCount = Array.isArray(item.comments) ? item.comments.length : 0;

                return (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-t border-gray-200 dark:border-gray-700 transition-colors ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/50"
                        : "bg-white dark:bg-gray-800"
                    } hover:bg-pink-50/50 dark:hover:bg-pink-900/10`}
                  >
                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex-shrink-0 relative group">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-semibold">
                            {item.category || "General"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Uploader */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs">
                          {uploaderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {uploaderName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status / Visibility */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          item.isPublic
                            ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-200"
                            : item.adminLocked
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-200"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        }`}>
                          {item.isPublic ? (
                            <>
                              <FiGlobe size={13} />
                              Public
                            </>
                          ) : item.adminLocked ? (
                            <>
                              <FiLock size={13} />
                              Admin Hidden
                            </>
                          ) : (
                            <>
                              <FiLock size={13} />
                              User Private
                            </>
                          )}
                        </span>
                        {item.unlockRequested && (
                          <div className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                            <span>🔔 Unlock requested</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1" title="Likes">
                          <FiHeart className="text-rose-500" size={13} />
                          {likesCount}
                        </span>
                        <span className="flex items-center gap-1" title="Comments">
                          <FiMessageSquare className="text-cyan-500" size={13} />
                          {commentsCount}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {/* Toggle Privacy: Disabled ONLY if image was made private by another user */}
                        <button
                          onClick={() => handleTogglePrivacy(item)}
                          disabled={isUserPrivateDisabled}
                          className={`p-2 rounded-lg text-sm font-bold transition-all ${
                            isUserPrivateDisabled
                              ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : item.isPublic
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-success-500/10 text-success-600 hover:bg-success-500/20"
                          }`}
                          title={
                            isUserPrivateDisabled
                              ? "User made this private (Admin view-only, cannot modify)"
                              : item.isPublic
                              ? "Hide / Make Private"
                              : "Unhide / Make Public"
                          }
                        >
                          {item.isPublic ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>

                        {/* Edit metadata: Disabled ONLY if image was made private by another user */}
                        <button
                          onClick={() => openEditModal(item)}
                          disabled={isUserPrivateDisabled}
                          className={`p-2 rounded-lg text-sm font-bold transition-all ${
                            isUserPrivateDisabled
                              ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                          }`}
                          title={
                            isUserPrivateDisabled
                              ? "User made this private (Admin view-only, cannot edit)"
                              : "Edit Image Details"
                          }
                        >
                          <FiEdit2 size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteMedia(item._id, item.title)}
                          className="p-2 rounded-lg text-sm font-bold bg-danger-500/10 text-danger-600 hover:bg-danger-500/20 transition-all"
                          title="Delete Image"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block mb-4 p-6 bg-gray-100 dark:bg-gray-700/50 rounded-2xl">
              <FiImage className="text-gray-400 dark:text-gray-500" size={56} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No images matched your filters
            </p>
          </div>
        )}
      </motion.div>

      {/* Edit Image Modal */}
      <AnimatePresence>
        {editingMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-5">
                <div className="flex items-center gap-2">
                  <FiEdit2 className="text-pink-500" size={20} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Image Details
                  </h3>
                </div>
                <button
                  onClick={() => setEditingMedia(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {categories.filter(c => c !== "all").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                      Visibility
                    </label>
                    <select
                      value={editForm.isPublic ? "public" : "private"}
                      onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.value === "public" })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="art, nature, 4k"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditingMedia(null)}
                    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageImages;

