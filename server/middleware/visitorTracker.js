// server/middleware/visitorTracker.js
const Visitor = require('../models/Visitor');
const logger = require('../config/logger');

/**
 * Get client IP address from request
 */
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

/**
 * Middleware to track visitor by IP
 */
const trackVisitor = async (req, res, next) => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (ipAddress && ipAddress !== 'unknown') {
      let visitor = await Visitor.findOne({ ipAddress });

      if (visitor) {
        // Existing visitor - update visit count and last visit
        await visitor.recordVisit();
      } else {
        // New visitor - create record
        visitor = new Visitor({
          ipAddress,
          userAgent,
          visitCount: 1,
          firstVisit: new Date(),
          lastVisit: new Date(),
          hasAcceptedTerms: false
        });
        await visitor.save();
        logger.info(`New visitor tracked: ${ipAddress}`);
      }

      // Attach visitor info to request
      req.visitor = visitor;
    }
  } catch (error) {
    logger.error('Error tracking visitor:', error);
    // Don't block the request if tracking fails
  }
  
  next();
};

/**
 * Check if visitor has accepted terms
 */
const checkTermsAcceptance = async (req, res, next) => {
  try {
    const ipAddress = getClientIP(req);
    
    if (ipAddress && ipAddress !== 'unknown') {
      const visitor = await Visitor.findOne({ ipAddress });
      
      if (visitor) {
        req.hasAcceptedTerms = visitor.hasAcceptedTerms;
        req.visitor = visitor;
      } else {
        req.hasAcceptedTerms = false;
      }
    }
  } catch (error) {
    logger.error('Error checking terms acceptance:', error);
  }
  
  next();
};

module.exports = {
  trackVisitor,
  checkTermsAcceptance,
  getClientIP
};