// server/utils/response.js
// Standardized API response helper

/**
 * Send success response
 */
const success = (res, message, data = null, statusCode = 200) => {
  const response = {
    status: 'success',
    message,
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
const error = (res, message, statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message,
  };
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  success,
  error,
};