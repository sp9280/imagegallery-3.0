// client/src/components/gallery/Upload.js
import React, { useState, useContext } from "react";
import { GalleryContext } from "../../context/GalleryContext";
import { getCurrentTheme } from "../../styles/theme";
import Alert from "../common/Alert";
import Layout from "../layout/Layout";

const Upload = () => {
  const [file, setFile] = useState(null);
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
  
  // New metadata fields
  const [photographer, setPhotographer] = useState("");
  const [location, setLocation] = useState("");
  const [camera, setCamera] = useState("");
  const [resolution, setResolution] = useState("");
  
  const { uploadMedia } = useContext(GalleryContext);
  const currentTheme = getCurrentTheme();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/quicktime'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload an image or video.");
        setFile(null);
        return;
      }
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      
      // Auto-detect resolution for images
      if (selectedFile.type.startsWith('image/')) {
        const img = new Image();
        img.onload = function() {
          const detectedResolution = `${this.width}x${this.height}`;
          setResolution(detectedResolution);
        };
        img.src = URL.createObjectURL(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
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
    
    // Add metadata fields
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
      setMessage("Upload successful!");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setPhotographer("");
      setLocation("");
      setCamera("");
      setResolution("");
      setProgress(0);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className={`upload-page ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
        <div className="upload-container glass-card">
          <div className="upload-header">
            <h2 className="gradient-text">Upload Your Media</h2>
            <p>Share your photos and videos with the community</p>
          </div>

          <form className="upload-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">* Title (Required)</label>
            <input
              id="title"
              type="text"
              placeholder="Enter an engaging title for your media"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="100"
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe your media content (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="500"
              rows="4"
              className="form-textarea"
            />
            <small className={`char-count ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {description.length}/500 characters
            </small>
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">* Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                required
              >
                <option value="General">General</option>
                <option value="Nature">Nature</option>
                <option value="Architecture">Architecture</option>
                <option value="People">People</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
              </select>
            </div>

            {/* License */}
            <div className="form-group">
              <label htmlFor="license">License</label>
              <select
                id="license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="form-input"
              >
                <option value="CC-BY-4.0">CC BY 4.0 (Attribution)</option>
                <option value="CC-BY-SA-4.0">CC BY-SA 4.0 (Attribution-ShareAlike)</option>
                <option value="CC-BY-NC-4.0">CC BY-NC 4.0 (Non-Commercial)</option>
                <option value="CC0">CC0 (Public Domain)</option>
                <option value="Copyright">Copyright (All Rights Reserved)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              placeholder="Add tags separated by commas (e.g: sunset, nature, travel)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Metadata Section */}
          <div className="form-section-header">
            <h3 className="text-lg font-bold gradient-text mt-4 mb-3 flex items-center gap-2">
              Image Details (Optional)
            </h3>
          </div>

          <div className="form-row">
            {/* Photographer */}
            <div className="form-group">
              <label htmlFor="photographer">Photographer / Artist</label>
              <input
                id="photographer"
                type="text"
                placeholder="Enter photographer name"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                maxLength="100"
                className="form-input"
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Where was this taken? (e.g., Paris, France)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength="100"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            {/* Camera */}
            <div className="form-group">
              <label htmlFor="camera">Camera / Device</label>
              <input
                id="camera"
                type="text"
                placeholder="Camera model (e.g., Canon EOS 5D, iPhone 14)"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                maxLength="100"
                className="form-input"
              />
            </div>

            {/* Resolution */}
            <div className="form-group">
              <label htmlFor="resolution">Resolution</label>
              <input
                id="resolution"
                type="text"
                placeholder="Auto-detected or enter manually (e.g., 1920x1080)"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                maxLength="50"
                className="form-input"
              />
              {file && file.type.startsWith('image/') && resolution && (
                <small className="text-green-600 text-xs mt-1">
                  Auto-detected: {resolution}
                </small>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label htmlFor="file">* Media File (Required)</label>
            <div className="file-input-wrapper upload-zone">
              <input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                required
                className="file-input"
              />
              <span className="file-label">
                {file ? `Selected: ${file.name}` : "Choose file or drag & drop"}
              </span>
            </div>
            <small className={`${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Supported: JPEG, PNG, GIF, MP4, AVI, MOV (Max 10MB)
            </small>
          </div>

          {/* Visibility */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="form-checkbox"
              />
              <span>Public (Anyone can see this media)</span>
            </label>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-upload btn-creative"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Media"}
            </button>
          </div>

          {/* Alerts */}
          {message && (
            <Alert 
              message={message} 
              type="success" 
              onClose={() => setMessage("")}
            />
          )}
          {error && (
            <Alert 
              message={error} 
              type="error" 
              onClose={() => setError("")}
            />
          )}
        </form>
      </div>
      </div>
    </Layout>
  );
};

export default Upload;
