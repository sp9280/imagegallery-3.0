// client/src/components/gallery/Upload.js
import React, { useState, useContext } from "react";
import { GalleryContext } from "../../context/GalleryContext";
import Alert from "../common/Alert";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [license, setLicense] = useState("CC-BY-4.0");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Metadata fields
  const [photographer, setPhotographer] = useState("");
  const [location, setLocation] = useState("");
  const [camera, setCamera] = useState("");
  const [resolution, setResolution] = useState("");

  const { uploadMedia } = useContext(GalleryContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/avi",
        "video/quicktime"
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP) or video.");
        setFile(null);
        setFilePreview(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        setFile(null);
        setFilePreview(null);
        return;
      }

      setFile(selectedFile);
      setError("");

      if (selectedFile.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);

        const img = new Image();
        img.onload = function () {
          setResolution(`${this.width}x${this.height}`);
        };
        img.src = previewUrl;
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setResolution("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image or video file.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for your media.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("isPublic", isPublic);
    formData.append("license", license);

    if (photographer.trim()) formData.append("photographer", photographer.trim());
    if (location.trim()) formData.append("location", location.trim());
    if (camera.trim()) formData.append("camera", camera.trim());
    if (resolution.trim()) formData.append("resolution", resolution.trim());

    try {
      setProgress(0);
      setError("");
      setMessage("");
      setUploading(true);
      await uploadMedia(formData);
      setMessage("Masterpiece uploaded successfully to your gallery!");
      setFile(null);
      setFilePreview(null);
      setTitle("");
      setDescription("");
      setTags("");
      setPhotographer("");
      setLocation("");
      setCamera("");
      setResolution("");
      setProgress(0);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please check your network and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Upload Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Creator Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Upload Your Visual Work
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Share your high-resolution photos, 3D renderings, and artwork with creators around the globe.
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <Alert message={message} type="success" onClose={() => setMessage("")} />
      )}
      {error && (
        <Alert message={error} type="error" onClose={() => setError("")} />
      )}

      {/* Upload Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Media File <span className="text-rose-500">*</span>
            </label>

            {filePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-[16/9] max-h-80 flex items-center justify-center">
                <img
                  src={filePreview}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 backdrop-blur-sm transition-colors shadow-lg"
                  title="Remove selected file"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur-sm">
                  {file?.name} ({resolution || "Detecting..."})
                </div>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 p-8 sm:p-12 text-center cursor-pointer transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CloudArrowUpIcon className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Click to select file or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, WEBP, GIF, or MP4 up to 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Give your work a captivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              >
                <option value="General">General Showcase</option>
                <option value="Nature">Nature & Wildlife</option>
                <option value="Architecture">Architecture & Urban</option>
                <option value="Art">Digital Art & 3D</option>
                <option value="People">People & Portraits</option>
                <option value="Technology">Technology & Sci-Fi</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length}/500
              </span>
            </div>
            <textarea
              id="description"
              placeholder="Tell the story behind this visual work, techniques used, or location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* License & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="license" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                License
              </label>
              <select
                id="license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              >
                <option value="CC-BY-4.0">CC BY 4.0 (Attribution)</option>
                <option value="CC-BY-SA-4.0">CC BY-SA 4.0 (Attribution-ShareAlike)</option>
                <option value="CC-BY-NC-4.0">CC BY-NC 4.0 (Non-Commercial)</option>
                <option value="CC0">CC0 (Public Domain)</option>
                <option value="Copyright">Copyright (All Rights Reserved)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="sunset, mountain, 4k, neon (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Optional EXIF / Camera Details */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <PhotoIcon className="w-4 h-4 text-indigo-500" />
              <span>Camera & Shot Details (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Photographer / Artist
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo, Japan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Camera / Lens
                </label>
                <input
                  type="text"
                  placeholder="Sony A7 IV, 24-70mm"
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Resolution
                </label>
                <input
                  type="text"
                  placeholder="3840x2160"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Visibility Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="isPublic" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Make this work publicly discoverable in the global community feed
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>{uploading ? "Publishing to Gallery..." : "Publish Masterpiece"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
