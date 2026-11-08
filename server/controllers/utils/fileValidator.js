// server/controllers/utils/fileValidator.js
// Utility to validate uploaded files

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validate uploaded file
 * @param {Object} file - Multer file object
 * @returns {Object} - { valid: boolean, message: string }
 */
const validate = (file) => {
  if (!file) {
    return {
      valid: false,
      message: 'No file provided',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      message: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`,
    };
  }

  return {
    valid: true,
    message: 'File is valid',
  };
};

module.exports = {
  validate,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
};