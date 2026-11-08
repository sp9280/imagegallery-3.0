// server/controllers/tcController.js
const TCAcceptance = require("../models/TCAcceptance");
const logger = require("../config/logger");

// Utility function to extract client IP
const getClientIP = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers["x-real-ip"];
  if (realIP) return realIP;
  const ip = req.ip || req.connection.remoteAddress;
  return ip || "unknown";
};

// Determine IP version
const getIPVersion = (ip) => {
  if (!ip || ip === "unknown") return null;
  if (ip.includes(":")) return "IPv6";
  if (ip.includes(".")) return "IPv4";
  return null;
};

// Parse User Agent for detailed info
const parseUserAgent = (userAgent) => {
  if (!userAgent) return {};
  
  const result = {
    browser: { name: "Unknown", version: "Unknown" },
    operatingSystem: { name: "Unknown", version: "Unknown" },
    device: { type: "desktop", vendor: null, model: null }
  };

  // Browser detection
  if (userAgent.includes("Chrome")) {
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    result.browser = { name: "Chrome", version: match ? match[1] : "Unknown" };
  } else if (userAgent.includes("Firefox")) {
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    result.browser = { name: "Firefox", version: match ? match[1] : "Unknown" };
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    const match = userAgent.match(/Version\/([0-9.]+)/);
    result.browser = { name: "Safari", version: match ? match[1] : "Unknown" };
  } else if (userAgent.includes("Edge")) {
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    result.browser = { name: "Edge", version: match ? match[1] : "Unknown" };
  }

  // OS detection
  if (userAgent.includes("Windows")) {
    result.operatingSystem = { name: "Windows", version: "Unknown" };
    if (userAgent.includes("Windows NT 10.0")) result.operatingSystem.version = "10";
    if (userAgent.includes("Windows NT 11.0")) result.operatingSystem.version = "11";
  } else if (userAgent.includes("Mac OS X")) {
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    result.operatingSystem = { 
      name: "macOS", 
      version: match ? match[1].replace(/_/g, ".") : "Unknown" 
    };
  } else if (userAgent.includes("Linux")) {
    result.operatingSystem = { name: "Linux", version: "Unknown" };
  } else if (userAgent.includes("Android")) {
    const match = userAgent.match(/Android ([0-9.]+)/);
    result.operatingSystem = { name: "Android", version: match ? match[1] : "Unknown" };
    result.device.type = "mobile";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    result.operatingSystem = { name: "iOS", version: "Unknown" };
    result.device.type = userAgent.includes("iPad") ? "tablet" : "mobile";
  }

  return result;
};

/**
 * Check if IP has accepted T&C and privacy policy
 * Gets the latest acceptance record for this IP
 */
const checkTCStatus = async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    
    // Find the most recent acceptance record for this IP
    const tcAcceptance = await TCAcceptance.findOne({ ipAddress })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!tcAcceptance) {
      return res.status(200).json({
        success: true,
        data: {
          hasAccepted: false,
          termsAccepted: false,
          privacyAccepted: false,
          cookiePreference: "essential",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        hasAccepted: tcAcceptance.termsAccepted && tcAcceptance.privacyAccepted,
        termsAccepted: tcAcceptance.termsAccepted,
        privacyAccepted: tcAcceptance.privacyAccepted,
        cookiePreference: tcAcceptance.cookiePreference,
        lastAction: tcAcceptance.action,
        lastAcceptedAt: tcAcceptance.acceptedAt,
      },
    });
  } catch (error) {
    logger.error("❌ Error checking T&C status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check T&C status",
    });
  }
};

/**
 * Accept T&C and Privacy Policy
 * Creates a new record for each acceptance
 */
const acceptTC = async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = req.headers["user-agent"] || null;
    const { 
      cookiePreference = "all",
      clientInfo = {}
    } = req.body;

    // Parse user agent for detailed information
    const parsedUA = parseUserAgent(userAgent);

    // Create a new acceptance record (always creates new, never updates)
    const tcAcceptance = new TCAcceptance({
      action: "accept",
      ipAddress,
      ipVersion: getIPVersion(ipAddress),
      userAgent,
      termsAccepted: true,
      privacyAccepted: true,
      cookiePreference,
      acceptedAt: new Date(),
      
      // Browser & Device info
      browser: parsedUA.browser,
      operatingSystem: parsedUA.operatingSystem,
      device: {
        type: parsedUA.device.type,
        vendor: parsedUA.device.vendor,
        model: parsedUA.device.model,
      },
      
      // Request headers
      referer: req.headers.referer || req.headers.referrer || null,
      acceptLanguage: req.headers["accept-language"] || null,
      acceptEncoding: req.headers["accept-encoding"] || null,
      
      // Client-side info (if provided)
      clientInfo: {
        screenResolution: clientInfo.screenResolution || null,
        colorDepth: clientInfo.colorDepth || null,
        timezone: clientInfo.timezone || null,
        timezoneOffset: clientInfo.timezoneOffset || null,
        platform: clientInfo.platform || null,
        language: clientInfo.language || null,
        cookiesEnabled: clientInfo.cookiesEnabled !== undefined ? clientInfo.cookiesEnabled : null,
      },
      
      // Session & fingerprint (if provided)
      sessionId: clientInfo.sessionId || null,
      fingerprint: clientInfo.fingerprint || null,
    });

    await tcAcceptance.save();
    
    logger.info(`✅ T&C ACCEPTED - IP: ${ipAddress} | Browser: ${parsedUA.browser.name} | OS: ${parsedUA.operatingSystem.name} | Cookie Pref: ${cookiePreference}`);

    return res.status(200).json({
      success: true,
      message: "Terms and Conditions accepted successfully",
      data: {
        termsAccepted: true,
        privacyAccepted: true,
        cookiePreference,
        recordId: tcAcceptance._id,
        timestamp: tcAcceptance.acceptedAt,
      },
    });
  } catch (error) {
    logger.error("❌ Error accepting T&C:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept Terms and Conditions",
    });
  }
};

/**
 * Reject T&C (For show only - actually accepts with essential cookies)
 * NOTE: Reject button is mandatory UX but functionally same as Accept
 * Creates a new record for each rejection
 */
const rejectTC = async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = req.headers["user-agent"] || null;
    const { clientInfo = {} } = req.body;

    // Parse user agent for detailed information
    const parsedUA = parseUserAgent(userAgent);

    // Create a new rejection record (always creates new, never updates)
    const tcAcceptance = new TCAcceptance({
      action: "reject",
      ipAddress,
      ipVersion: getIPVersion(ipAddress),
      userAgent,
      termsAccepted: true, // Still marked as accepted (UX requirement)
      privacyAccepted: true, // Still marked as accepted (UX requirement)
      cookiePreference: "essential", // Only difference - essential cookies only
      acceptedAt: new Date(),
      
      // Browser & Device info
      browser: parsedUA.browser,
      operatingSystem: parsedUA.operatingSystem,
      device: {
        type: parsedUA.device.type,
        vendor: parsedUA.device.vendor,
        model: parsedUA.device.model,
      },
      
      // Request headers
      referer: req.headers.referer || req.headers.referrer || null,
      acceptLanguage: req.headers["accept-language"] || null,
      acceptEncoding: req.headers["accept-encoding"] || null,
      
      // Client-side info (if provided)
      clientInfo: {
        screenResolution: clientInfo.screenResolution || null,
        colorDepth: clientInfo.colorDepth || null,
        timezone: clientInfo.timezone || null,
        timezoneOffset: clientInfo.timezoneOffset || null,
        platform: clientInfo.platform || null,
        language: clientInfo.language || null,
        cookiesEnabled: clientInfo.cookiesEnabled !== undefined ? clientInfo.cookiesEnabled : null,
      },
      
      // Session & fingerprint (if provided)
      sessionId: clientInfo.sessionId || null,
      fingerprint: clientInfo.fingerprint || null,
    });

    await tcAcceptance.save();
    
    logger.info(`⚠️ T&C REJECTED (essential only) - IP: ${ipAddress} | Browser: ${parsedUA.browser.name} | OS: ${parsedUA.operatingSystem.name}`);

    return res.status(200).json({
      success: true,
      message: "Terms accepted - Essential cookies only",
      data: {
        termsAccepted: true, // Return true so user can proceed
        privacyAccepted: true, // Return true so user can proceed
        cookiePreference: "essential",
        recordId: tcAcceptance._id,
        timestamp: tcAcceptance.acceptedAt,
      },
    });
  } catch (error) {
    logger.error("❌ Error processing T&C rejection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save preference",
    });
  }
};

/**
 * Get all TC acceptance/rejection history (Admin endpoint)
 * Supports filtering and pagination
 */
const getTCHistory = async (req, res) => {
  try {
    const { 
      ipAddress, 
      action, 
      page = 1, 
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build query
    const query = {};
    if (ipAddress) query.ipAddress = ipAddress;
    if (action) query.action = action;

    // Calculate skip
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get records with pagination
    const records = await TCAcceptance.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const totalRecords = await TCAcceptance.countDocuments(query);

    // Get statistics
    const stats = {
      totalAcceptances: await TCAcceptance.countDocuments({ action: "accept" }),
      totalRejections: await TCAcceptance.countDocuments({ action: "reject" }),
      uniqueIPs: await TCAcceptance.distinct("ipAddress").then(ips => ips.length),
      last24Hours: await TCAcceptance.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
    };

    logger.info(`📊 TC History requested - Page: ${page}, Limit: ${limit}, Total: ${totalRecords}`);

    return res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRecords / parseInt(limit)),
          totalRecords,
          recordsPerPage: parseInt(limit),
        },
        statistics: stats,
      },
    });
  } catch (error) {
    logger.error("❌ Error fetching TC history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch TC history",
    });
  }
};

/**
 * Get TC history for specific IP (Admin endpoint)
 */
const getTCHistoryByIP = async (req, res) => {
  try {
    const { ipAddress } = req.params;

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        message: "IP address is required",
      });
    }

    const records = await TCAcceptance.find({ ipAddress })
      .sort({ createdAt: -1 })
      .lean();

    logger.info(`📋 TC History for IP ${ipAddress} - Found ${records.length} records`);

    return res.status(200).json({
      success: true,
      data: {
        ipAddress,
        totalRecords: records.length,
        records,
      },
    });
  } catch (error) {
    logger.error("❌ Error fetching TC history by IP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch TC history",
    });
  }
};

module.exports = {
  checkTCStatus,
  acceptTC,
  rejectTC,
  getTCHistory,
  getTCHistoryByIP,
};