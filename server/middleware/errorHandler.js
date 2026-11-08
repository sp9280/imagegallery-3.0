// Express error handler middleware
const logger = require('../config/logger');

module.exports = function (err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || '127.0.0.1';

  logger.error(`[HTTP ${statusCode}] ${req.method} ${req.originalUrl} - IP: ${clientIP} - Message: ${err.message}`, {
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user ? { id: req.user.id || req.user._id, role: req.user.role } : 'unauthenticated'
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
