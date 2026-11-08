// client/src/components/gallery/Upload.js
import React, { useState, useContext } from "react";
import { GalleryContext } from "../../context/GalleryContext";
import Alert from "../common/Alert";
import exifr from "exifr";
import {
  CloudArrowUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
  MapPinIcon,
  CpuChipIcon,
  BoltIcon
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

  // Detailed Shot & EXIF Metadata Fields
  const [photographer, setPhotographer] = useState("");
  const [camera, setCamera] = useState("");
  const [cameraType, setCameraType] = useState("Mirrorless");
  const [resolution, setResolution] = useState("");
  const [captureDate, setCaptureDate] = useState("");
  const [location, setLocation] = useState("");
  const [aperture, setAperture] = useState("");
  const [focalLength, setFocalLength] = useState("");
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [aiModel, setAiModel] = useState("");

  // Auto-detection tracking
  const [autoDetectedData, setAutoDetectedData] = useState(null);
  const [isParsingExif, setIsParsingExif] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const { uploadMedia } = useContext(GalleryContext);

  const parseExifData = async (selectedFile) => {
    setIsParsingExif(true);
    try {
      const exif = await exifr.parse(selectedFile, {
        tiff: true,
        xmp: true,
        jfif: true,
        ihdr: true,
      });

      if (exif) {
        // 1. Camera Make & Model
        const make = exif.Make ? String(exif.Make).trim() : "";
        const model = exif.Model ? String(exif.Model).trim() : "";
        let detectedCamera = [make, model].filter(Boolean).join(" ");
        if (model && make && model.toLowerCase().startsWith(make.toLowerCase())) {
          detectedCamera = model;
        }

        // 2. Camera Type Heuristic
        let detectedType = "Dedicated Camera";
        const lowerCam = detectedCamera.toLowerCase();
        if (
          lowerCam.includes("apple") ||
          lowerCam.includes("iphone") ||
          lowerCam.includes("pixel") ||
          lowerCam.includes("samsung") ||
          lowerCam.includes("galaxy") ||
          lowerCam.includes("xiaomi")
        ) {
          detectedType = "Smartphone";
        } else if (
          lowerCam.includes("dji") ||
          lowerCam.includes("drone") ||
          lowerCam.includes("mavic") ||
          lowerCam.includes("autel")
        ) {
          detectedType = "Drone";
        } else if (
          lowerCam.includes("a7") ||
          lowerCam.includes("eos r") ||
          lowerCam.includes("z6") ||
          lowerCam.includes("z7") ||
          lowerCam.includes("z8") ||
          lowerCam.includes("fujifilm") ||
          lowerCam.includes("leica") ||
          lowerCam.includes("hasselblad")
        ) {
          detectedType = "Mirrorless";
        } else if (
          lowerCam.includes("mark") ||
          lowerCam.includes("rebel") ||
          lowerCam.includes("d850") ||
          lowerCam.includes("d750")
        ) {
          detectedType = "DSLR";
        }

        // 3. Resolution
        let detectedRes = "";
        if (exif.ImageWidth && exif.ImageHeight) {
          detectedRes = `${exif.ImageWidth}x${exif.ImageHeight}`;
        }

        // 4. Capture Date & Time
        let detectedDate = "";
        const dateObj = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate;
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
          // Format as YYYY-MM-DDTHH:mm for datetime-local
          const pad = (n) => String(n).padStart(2, "0");
          detectedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
            dateObj.getDate()
          )}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
        }

        // 5. Aperture
        let detectedAperture = "";
        if (exif.FNumber) {
          detectedAperture = `f/${Number(exif.FNumber.toFixed(1))}`;
        }

        // 6. Focus / Focal Length
        let detectedFocus = "";
        if (exif.FocalLength) {
          detectedFocus = `${Number(exif.FocalLength.toFixed(1))}mm`;
        }

        // 7. Location Coordinates
        let detectedLoc = "";
        if (typeof exif.latitude === "number" && typeof exif.longitude === "number") {
          detectedLoc = `${exif.latitude.toFixed(4)}°, ${exif.longitude.toFixed(4)}°`;
        }

        // 8. AI Generation Traces
        const software = String(exif.Software || "").toLowerCase();
        const desc = String(exif.ImageDescription || exif.UserComment || "").toLowerCase();
        const aiKeys = [
          "midjourney",
          "stable diffusion",
          "dall-e",
          "dalle",
          "comfyui",
          "novelai",
          "firefly",
          "flux.1",
          "civitai",
          "automatic1111",
          "ai generated",
        ];
        const isAi = aiKeys.some((k) => software.includes(k) || desc.includes(k));
        let detectedAi = "";
        if (isAi) {
          if (software.includes("midjourney") || desc.includes("midjourney")) detectedAi = "Midjourney";
          else if (software.includes("dall-e") || software.includes("dalle") || desc.includes("dall-e")) detectedAi = "DALL-E";
          else if (software.includes("comfyui")) detectedAi = "ComfyUI";
          else if (software.includes("stable diffusion")) detectedAi = "Stable Diffusion";
          else if (software.includes("firefly")) detectedAi = "Adobe Firefly";
          else detectedAi = "Generative AI";
        }

        // Photographer from artist tag
        const detectedArtist = exif.Artist ? String(exif.Artist).trim() : "";

        const detected = {
          camera: detectedCamera,
          cameraType: detectedType,
          resolution: detectedRes,
          captureDate: detectedDate,
          aperture: detectedAperture,
          focalLength: detectedFocus,
          location: detectedLoc,
          isAiGenerated: isAi,
          aiModel: detectedAi,
          photographer: detectedArtist,
        };

        setAutoDetectedData(detected);

        // Auto-fill values if user hasn't typed anything yet!
        if (detectedCamera) setCamera((prev) => prev || detectedCamera);
        if (detectedType) setCameraType((prev) => prev || detectedType);
        if (detectedRes) setResolution((prev) => prev || detectedRes);
        if (detectedDate) setCaptureDate((prev) => prev || detectedDate);
        if (detectedAperture) setAperture((prev) => prev || detectedAperture);
        if (detectedFocus) setFocalLength((prev) => prev || detectedFocus);
        if (detectedLoc) setLocation((prev) => prev || detectedLoc);
        if (detectedArtist) setPhotographer((prev) => prev || detectedArtist);
        if (isAi) {
          setIsAiGenerated(true);
          if (detectedAi) setAiModel((prev) => prev || detectedAi);
        }
      }
    } catch (e) {
      console.log("No EXIF metadata in file:", e);
    } finally {
      setIsParsingExif(false);
    }
  };

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
        "video/quicktime",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file format. Please upload JPG, PNG, WEBP, GIF, or MP4.");
        setFile(null);
        setFilePreview(null);
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError("File size exceeds 15MB limit.");
        setFile(null);
        setFilePreview(null);
        return;
      }

      setFile(selectedFile);
      setError("");

      if (selectedFile.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);

        // Fallback resolution detection via Image loader
        const img = new Image();
        img.onload = function () {
          setResolution((prev) => prev || `${this.width}x${this.height}`);
        };
        img.src = previewUrl;

        // Auto-detect metadata via EXIF
        parseExifData(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setAutoDetectedData(null);
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

    // Metadata fields (manual entry or auto-filled)
    if (photographer.trim()) formData.append("photographer", photographer.trim());
    if (camera.trim()) formData.append("camera", camera.trim());
    if (cameraType.trim()) formData.append("cameraType", cameraType.trim());
    if (resolution.trim()) formData.append("resolution", resolution.trim());
    if (captureDate.trim()) formData.append("captureDate", captureDate.trim());
    if (location.trim()) formData.append("location", location.trim());
    if (aperture.trim()) formData.append("aperture", aperture.trim());
    if (focalLength.trim()) formData.append("focalLength", focalLength.trim());
    formData.append("isAiGenerated", isAiGenerated);
    if (aiModel.trim()) formData.append("aiModel", aiModel.trim());

    try {
      setError("");
      setMessage("");
      setUploading(true);
      await uploadMedia(formData);
      setMessage("✨ Masterpiece uploaded successfully with full image DNA!");
      setFile(null);
      setFilePreview(null);
      setTitle("");
      setDescription("");
      setTags("");
      setPhotographer("");
      setCamera("");
      setLocation("");
      setAperture("");
      setFocalLength("");
      setCaptureDate("");
      setResolution("");
      setIsAiGenerated(false);
      setAiModel("");
      setAutoDetectedData(null);
      setTimeout(() => setMessage(""), 6000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please check server connection and retry.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Studio Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,245,212,0.15)]">
          <SparklesIcon className="w-4 h-4 text-cyan-300 animate-spin-slow" />
          <span>Intelligent Media Studio • Auto-EXIF Enabled</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Publish Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
            Visual Masterpiece
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Drop your photo to auto-extract camera, resolution, focal length, aperture, and capture details.
        </p>
      </div>

      {message && <Alert message={message} type="success" onClose={() => setMessage("")} />}
      {error && <Alert message={error} type="error" onClose={() => setError("")} />}

      {/* Main Studio Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 transition-all">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload & Auto-Detect Dropzone */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>Select Media File</span>
                <span className="text-rose-500">*</span>
              </label>
              {isParsingExif && (
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 animate-pulse">
                  <BoltIcon className="w-3.5 h-3.5 animate-spin" />
                  Auto-analyzing Image EXIF DNA...
                </span>
              )}
            </div>

            {filePreview ? (
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 aspect-[16/9] max-h-96 flex items-center justify-center shadow-xl group">
                <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 backdrop-blur-md transition-all shadow-lg"
                  title="Remove image"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                    {file?.name}
                  </span>
                  {resolution && (
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md text-cyan-300 text-xs font-bold border border-cyan-500/40">
                      📐 {resolution}
                    </span>
                  )}
                  {camera && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md text-purple-300 text-xs font-bold border border-purple-500/40">
                      📷 {camera}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <label
                htmlFor="studio-file-upload"
                className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-400 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-cyan-500/5 p-10 sm:p-14 text-center cursor-pointer transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 shadow-lg shadow-cyan-500/10 transition-transform">
                  <CloudArrowUpIcon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                  Drag & Drop or Choose Image
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Camera, lens, aperture, resolution, location, and date will be{" "}
                  <strong className="text-cyan-400">automatically detected</strong>.
                </p>
                <span className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                  Browse Files
                </span>
                <input
                  id="studio-file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Auto-Detection Notification Banner */}
          {autoDetectedData && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-950/40 border border-cyan-400/40 text-cyan-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>
                  <strong>EXIF Auto-Fetch Activated:</strong> Camera, resolution, and lens specs pre-filled from image metadata. You can review or edit below.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px] uppercase tracking-wider shrink-0">
                Auto-Synchronized
              </span>
            </div>
          )}

          {/* Basic Media Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Artwork Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Celestial Sunrise over Mt. Fuji"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Primary Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm font-medium"
              >
                <option value="General">General Showcase</option>
                <option value="Nature">Nature & Wildlife</option>
                <option value="Architecture">Architecture & Urban</option>
                <option value="Art">Digital Art & 3D</option>
                <option value="People">People & Portraits</option>
                <option value="Technology">Technology & Cyber</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Description & Artistic Story
            </label>
            <textarea
              placeholder="Provide background context, equipment notes, or the vision behind this capture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm font-medium"
            />
          </div>

          {/* ========================================================
              TECHNICAL IMAGE DNA (Camera, Resolution, Aperture, Date, AI)
          ======================================================== */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Technical Shot Details (Image DNA)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Auto-filled from EXIF or customize manually
              </span>
            </div>

            {/* Row 1: Camera Model & Camera Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Camera Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sony A7 IV, Canon EOS R5"
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Camera Type
                </label>
                <select
                  value={cameraType}
                  onChange={(e) => setCameraType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="Mirrorless">Mirrorless</option>
                  <option value="DSLR">DSLR</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Drone">Drone Aerial</option>
                  <option value="Medium Format">Medium Format</option>
                  <option value="Compact">Compact / Point & Shoot</option>
                  <option value="Cinema">Cinema Camera</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Resolution
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6000x4000 (4K/6K)"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Row 2: Aperture, Focus / Focal Length, Captured Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Aperture (f-stop)
                </label>
                <input
                  type="text"
                  placeholder="e.g. f/1.8, f/2.8, f/8"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Focus / Focal Length
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50mm, 24-70mm"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Captured Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={captureDate}
                  onChange={(e) => setCaptureDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Row 3: Location & Artist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>Location (GPS or City)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Japan or 35.6762°, 139.6503°"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Photographer / Creator Credit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Your Name or Studio Handle"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* AI Generated Classification Toggle */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CpuChipIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    AI Generated Classification
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Indicate if this artwork was created using Midjourney, DALL-E, Stable Diffusion, or other AI engines.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAiGenerated}
                    onChange={(e) => setIsAiGenerated(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAiGenerated ? "AI Generated" : "Optical Capture"}
                  </span>
                </label>

                {isAiGenerated && (
                  <input
                    type="text"
                    placeholder="Engine (e.g. Midjourney v6)"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-purple-500/40 bg-slate-900 text-purple-200 text-xs focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Visibility & License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                id="studio-isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="studio-isPublic" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Publish publicly in global showcase feed
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Usage License
              </label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-xs"
              >
                <option value="CC-BY-4.0">Creative Commons (CC BY 4.0)</option>
                <option value="CC0">Public Domain (CC0)</option>
                <option value="Copyright">All Rights Reserved</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,245,212,0.3)] hover:shadow-[0_0_35px_rgba(0,245,212,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <SparklesIcon className="w-5 h-5 text-white" />
              <span>{uploading ? "Analyzing & Publishing..." : "Publish Visual Masterpiece"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
