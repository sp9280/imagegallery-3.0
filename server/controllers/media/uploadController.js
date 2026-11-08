// server/controllers/media/uploadController.js
const Media = require('../../models/Media');
const response = require('../../utils/response');
const logger = require('../../config/logger');
const fileValidator = require('../utils/fileValidator');
const imageOptimizer = require('../utils/imageOptimizer');
const exifParser = require('exif-parser');
const path = require('path');
const fs = require('fs').promises;

const toDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    if (value > 1e12) {
      return new Date(value);
    }
    return new Date(value * 1000);
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  return undefined;
};

const formatExposureTime = (value) => {
  if (!value || value <= 0) return undefined;
  if (value >= 1) {
    return `${value.toFixed(1)}s`;
  }
  const denominator = Math.round(1 / value);
  if (denominator === 0) return undefined;
  return `1/${denominator}`;
};

const normalizeCoordinate = (value, ref) => {
  if (typeof value !== 'number') return undefined;
  if (ref === 'S' || ref === 'W') {
    return -Math.abs(value);
  }
  return Math.abs(value);
};

const extractMetadata = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    const tags = result.tags || {};

    const metadata = {};

    if (tags.Make) metadata.cameraMake = String(tags.Make).trim();
    if (tags.Model) metadata.cameraModel = String(tags.Model).trim();
    if (tags.LensModel) metadata.lensModel = String(tags.LensModel).trim();
    if (tags.Artist) metadata.artist = String(tags.Artist).trim();

    const captureDate = toDate(tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate);
    if (captureDate && !Number.isNaN(captureDate.getTime())) {
      metadata.captureDate = captureDate;
    }

    const exposure = formatExposureTime(tags.ExposureTime);
    if (exposure) metadata.exposureTime = exposure;

    if (typeof tags.FNumber === 'number' && tags.FNumber > 0) {
      metadata.aperture = Number(tags.FNumber.toFixed(1));
    }

    if (typeof tags.ISO === 'number' && tags.ISO > 0) {
      metadata.iso = tags.ISO;
    }

    if (typeof tags.FocalLength === 'number' && tags.FocalLength > 0) {
      metadata.focalLength = Number(tags.FocalLength.toFixed(1));
    }

    // Resolution from image tags or size
    const imageSize = result.getImageSize ? result.getImageSize() : (result.imageSize || {});
    if (imageSize.width && imageSize.height) {
      metadata.resolution = `${imageSize.width}x${imageSize.height}`;
    }

    // Camera Type detection heuristic
    const make = (metadata.cameraMake || '').toLowerCase();
    const model = (metadata.cameraModel || '').toLowerCase();
    if (make.includes('apple') || make.includes('samsung') || make.includes('google') || model.includes('pixel') || model.includes('iphone') || model.includes('galaxy') || model.includes('xiaomi') || model.includes('huawei')) {
      metadata.cameraType = 'Smartphone';
    } else if (make.includes('dji') || model.includes('drone') || model.includes('mavic') || model.includes('mini') || model.includes('autel')) {
      metadata.cameraType = 'Drone';
    } else if (model.includes('eos r') || model.includes('a7') || model.includes('a9') || model.includes('a1') || model.includes('z6') || model.includes('z7') || model.includes('z8') || model.includes('z9') || make.includes('fujifilm') || make.includes('leica') || make.includes('hasselblad')) {
      metadata.cameraType = 'Mirrorless';
    } else if (model.includes('mark') || model.includes('rebel') || model.includes('d850') || model.includes('d750') || model.includes('d5600')) {
      metadata.cameraType = 'DSLR';
    } else if (make || model) {
      metadata.cameraType = 'Dedicated Camera';
    }

    // AI Generated detection heuristics
    const software = String(tags.Software || '').toLowerCase();
    const comment = String(tags.UserComment || tags.ImageDescription || '').toLowerCase();
    const aiKeywords = ['midjourney', 'stable diffusion', 'dall-e', 'dalle', 'comfyui', 'novelai', 'firefly', 'civitai', 'flux.1', 'automatic1111', 'invokeai', 'ai generated'];
    const isAi = aiKeywords.some(kw => software.includes(kw) || comment.includes(kw));
    if (isAi) {
      metadata.isAiGenerated = true;
      if (software.includes('midjourney') || comment.includes('midjourney')) metadata.aiModel = 'Midjourney';
      else if (software.includes('dall-e') || software.includes('dalle') || comment.includes('dall-e')) metadata.aiModel = 'DALL-E';
      else if (software.includes('comfyui') || comment.includes('comfyui')) metadata.aiModel = 'ComfyUI';
      else if (software.includes('stable diffusion') || comment.includes('stable diffusion')) metadata.aiModel = 'Stable Diffusion';
      else if (software.includes('firefly') || comment.includes('firefly')) metadata.aiModel = 'Adobe Firefly';
      else metadata.aiModel = 'Generative AI';
    } else {
      metadata.isAiGenerated = false;
    }

    const latitude = normalizeCoordinate(tags.GPSLatitude, tags.GPSLatitudeRef);
    const longitude = normalizeCoordinate(tags.GPSLongitude, tags.GPSLongitudeRef);
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      metadata.location = { latitude, longitude };
    }

    if (Object.keys(metadata).length === 0) {
      return undefined;
    }

    return metadata;
  } catch (err) {
    logger.warn('Failed to extract EXIF metadata:', err);
    return undefined;
  }
};

/**
 * Upload media file
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return response.error(res, 'No file uploaded', 400);
    }

    const { 
      title, 
      category = 'General', 
      description = '', 
      tags = '',
      isPublic = true,
      license = 'CC-BY-4.0',
      // Manual metadata fields (if filled, override auto-detected EXIF)
      photographer = '',
      location = '',
      camera = '',
      cameraType = '',
      resolution = '',
      captureDate = '',
      aperture = '',
      focalLength = '',
      isAiGenerated,
      aiModel = ''
    } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return response.error(res, 'Title is required', 400);
    }

    const validation = fileValidator.validate(req.file);
    if (!validation.valid) {
      return response.error(res, validation.message, 400);
    }

    let optimizedPath = req.file.path;
    if (req.file.mimetype.startsWith('image/')) {
      try {
        optimizedPath = await imageOptimizer.optimize(req.file.path);
      } catch (optimizeErr) {
        logger.warn('Image optimization failed, using original:', optimizeErr);
      }
    }

    const tagsArray = tags 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Extract EXIF metadata
    let metadata;
    if (req.file.mimetype.startsWith('image/')) {
      metadata = await extractMetadata(optimizedPath);
    }
    
    // Merge manual metadata with auto-detected EXIF
    if (!metadata) metadata = {};
    
    // Override or add photographer/artist
    if (photographer && photographer.trim()) {
      metadata.artist = photographer.trim();
    }
    
    // Add location (as text, not GPS coordinates)
    if (location && location.trim()) {
      metadata.locationText = location.trim();
    }
    
    // Add camera info (manual entry overrides EXIF if provided)
    if (camera && camera.trim()) {
      const cameraText = camera.trim();
      // Try to parse camera make and model if format is "Make Model"
      const parts = cameraText.split(' ');
      if (parts.length >= 2) {
        metadata.cameraMake = parts[0];
        metadata.cameraModel = parts.slice(1).join(' ');
      } else {
        metadata.cameraModel = cameraText;
      }
    }
    
    // Add resolution
    if (resolution && resolution.trim()) {
      metadata.resolution = resolution.trim();
    }

    // Add camera type
    if (cameraType && cameraType.trim()) {
      metadata.cameraType = cameraType.trim();
    }

    // Add capture date
    if (captureDate && captureDate.trim()) {
      const d = new Date(captureDate.trim());
      if (!Number.isNaN(d.getTime())) {
        metadata.captureDate = d;
      }
    }

    // Add aperture
    if (aperture) {
      const numAperture = parseFloat(String(aperture).replace(/f\/?/i, '').trim());
      if (!Number.isNaN(numAperture)) {
        metadata.aperture = numAperture;
      }
    }

    // Add focal length / focus
    if (focalLength) {
      const numFocus = parseFloat(String(focalLength).replace(/mm/i, '').trim());
      if (!Number.isNaN(numFocus)) {
        metadata.focalLength = numFocus;
      }
    }

    // AI generated flag
    if (isAiGenerated !== undefined && isAiGenerated !== '') {
      metadata.isAiGenerated = isAiGenerated === true || isAiGenerated === 'true';
    }

    // AI model
    if (aiModel && aiModel.trim()) {
      metadata.aiModel = aiModel.trim();
    }
    
    // Only keep metadata if it has any properties
    if (Object.keys(metadata).length === 0) {
      metadata = undefined;
    }

    const media = new Media({
      title: title.trim(),
      description: description.trim(),
      category,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${path.basename(optimizedPath)}`,
      user: userId,
      tags: tagsArray,
      license: license || 'CC-BY-4.0',
      isPublic: isPublic === true || isPublic === 'true',
      isHidden: false,
      likedByIPs: [],
      metadata
    });

    const savedMedia = await media.save();

    logger.info(`✅ Media uploaded: "${title}" (ID: ${savedMedia._id}) by user ${userId}`);
    response.success(res, 'Media uploaded successfully', {
      media: {
        id: savedMedia._id,
        title: savedMedia.title,
        description: savedMedia.description,
        url: savedMedia.url,
        category: savedMedia.category,
        tags: savedMedia.tags,
        license: savedMedia.license,
        isPublic: savedMedia.isPublic,
        createdAt: savedMedia.createdAt,
        metadata: savedMedia.metadata
      },
    });
  } catch (err) {
    logger.error('Error uploading media:', err);
    response.error(res, 'Failed to upload media', 500);
  }
};

/**
 * Delete media
 */
const deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;
    const userId = req.user.id || req.user._id;
    const isAdmin = req.user.role === 'admin';

    const query = { _id: mediaId };
    if (!isAdmin) {
      query.user = userId;
    }

    const media = await Media.findOne(query);
    if (!media) {
      return response.error(res, 'Media not found or unauthorized', 404);
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../uploads', media.filename);
    try {
      await fs.unlink(filePath);
    } catch (fileErr) {
      logger.warn(`Failed to delete file ${filePath}:`, fileErr);
    }

    await Media.findByIdAndDelete(mediaId);

    logger.info(`Media deleted: ${mediaId} by user ${userId}`);
    response.success(res, 'Media deleted successfully');
  } catch (err) {
    logger.error('Error deleting media:', err);
    response.error(res, 'Failed to delete media', 500);
  }
};

module.exports = {
  uploadMedia,
  deleteMedia,
};
