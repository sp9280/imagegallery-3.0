// server/routes/visitorRoutes.js
const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const TCAcceptance = require('../models/TCAcceptance');
const { getClientIP } = require('../middleware/visitorTracker');
const response = require('../utils/response');
const logger = require('../config/logger');
const UAParser = require('ua-parser-js');

/**
 * GET /api/visitor/status
 * Check visitor terms acceptance status
 */
router.get('/status', async (req, res) => {
  try {
    const ipAddress = getClientIP(req);

    if (!ipAddress || ipAddress === 'unknown') {
      return response.success(res, 'Visitor status retrieved', {
        hasAcceptedTerms: false,
        isNewVisitor: true
      });
    }

    const visitor = await Visitor.findOne({ ipAddress });

    if (!visitor) {
      return response.success(res, 'Visitor status retrieved', {
        hasAcceptedTerms: false,
        isNewVisitor: true
      });
    }

    response.success(res, 'Visitor status retrieved', {
      hasAcceptedTerms: visitor.hasAcceptedTerms,
      isNewVisitor: false,
      visitCount: visitor.visitCount,
      firstVisit: visitor.firstVisit
    });
  } catch (error) {
    logger.error('Error getting visitor status:', error);
    response.error(res, 'Failed to get visitor status', 500);
  }
});

/**
 * Helper to save TC Acceptance record
 */
const saveAcceptanceRecord = async (req, ipAddress, action) => {
  try {
    const ua = UAParser(req.headers['user-agent']);

    const acceptance = new TCAcceptance({
      action,
      ipAddress,
      termsAccepted: true,
      privacyAccepted: true,
      cookiePreference: action === 'accept' ? 'all' : 'essential',
      userAgent: req.headers['user-agent'],
      browser: {
        name: ua.browser.name,
        version: ua.browser.version
      },
      device: {
        type: ua.device.type || 'desktop', // Default to desktop if undefined
        vendor: ua.device.vendor,
        model: ua.device.model
      },
      operatingSystem: {
        name: ua.os.name,
        version: ua.os.version
      }
    });

    await acceptance.save();
    logger.info(`TCAcceptance recorded: ${action} from ${ipAddress}`);
  } catch (err) {
    logger.error('Error saving TCAcceptance record:', err);
    // Continue execution, don't fail the request just because logging failed
  }
};

/**
 * POST /api/visitor/accept-terms
 * Accept terms and conditions
 */
router.post('/accept-terms', async (req, res) => {
  try {
    const ipAddress = getClientIP(req);

    if (!ipAddress || ipAddress === 'unknown') {
      return response.error(res, 'Could not identify visitor', 400);
    }

    // 1. Update Visitor Record (current logic)
    let visitor = await Visitor.findOne({ ipAddress });

    if (!visitor) {
      visitor = new Visitor({
        ipAddress,
        userAgent: req.headers['user-agent'] || 'unknown',
        hasAcceptedTerms: true,
        termsAcceptedAt: new Date()
      });
    } else {
      visitor.hasAcceptedTerms = true;
      visitor.termsAcceptedAt = new Date();
    }

    await visitor.save();

    // 2. Create TCAcceptance Record (New requirement)
    // Run in background (fire & forget) to not block response
    saveAcceptanceRecord(req, ipAddress, 'accept').catch(err =>
      logger.error('Background saveAcceptanceRecord failed:', err)
    );

    response.success(res, 'Terms accepted successfully', {
      hasAcceptedTerms: true
    });
  } catch (error) {
    logger.error('Error accepting terms:', error);
    response.error(res, 'Failed to accept terms', 500);
  }
});

/**
 * POST /api/visitor/reject-terms
 * Reject terms (actually accepts with essential cookies only)
 */
router.post('/reject-terms', async (req, res) => {
  try {
    const ipAddress = getClientIP(req);

    if (!ipAddress || ipAddress === 'unknown') {
      return response.error(res, 'Could not identify visitor', 400);
    }

    // 1. Update Visitor Record
    // We still await this one as it's critical for the immediate "hasAcceptedTerms" logic check on subsequent requests
    let visitor = await Visitor.findOne({ ipAddress });

    if (!visitor) {
      visitor = new Visitor({
        ipAddress,
        userAgent: req.headers['user-agent'] || 'unknown',
        hasAcceptedTerms: true, // Still marked accepted to prevent popup
        termsAcceptedAt: new Date()
      });
    } else {
      visitor.hasAcceptedTerms = true;
      visitor.termsAcceptedAt = new Date();
    }

    await visitor.save();

    // 2. Create TCAcceptance Record
    // Run in background (fire & forget)
    saveAcceptanceRecord(req, ipAddress, 'reject').catch(err =>
      logger.error('Background saveAcceptanceRecord failed:', err)
    );

    response.success(res, 'Terms accepted (essential only)', {
      hasAcceptedTerms: true
    });
  } catch (error) {
    logger.error('Error processing terms rejection:', error);
    response.error(res, 'Failed to process terms', 500);
  }
});

/**
 * GET /api/visitor/stats (Admin only)
 * Get visitor statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const acceptedTerms = await Visitor.countDocuments({ hasAcceptedTerms: true });
    const totalVisits = await Visitor.aggregate([
      { $group: { _id: null, total: { $sum: '$visitCount' } } }
    ]);

    // Get detailed stats from TCAcceptance
    const acceptanceStats = await TCAcceptance.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } }
    ]);

    response.success(res, 'Visitor statistics retrieved', {
      totalVisitors,
      acceptedTerms,
      totalVisits: totalVisits[0]?.total || 0,
      acceptanceDetails: acceptanceStats
    });
  } catch (error) {
    logger.error('Error getting visitor stats:', error);
    response.error(res, 'Failed to get visitor statistics', 500);
  }
});

module.exports = router;