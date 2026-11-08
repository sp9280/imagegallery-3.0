// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/media/authController");
const { 
  checkTCStatus, 
  acceptTC, 
  rejectTC,
  getTCHistory,
  getTCHistoryByIP
} = require("../controllers/tcController");
const { protect } = require("../middleware/auth");
const role = require("../middleware/role");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", require("../controllers/media/authController").verifyEmail);

// Terms & Conditions routes (public - no auth required)
router.get("/tc/status", checkTCStatus);
router.post("/tc/accept", acceptTC);
router.post("/tc/reject", rejectTC);

// Admin routes for TC history (requires admin authentication)
router.get("/tc/history", protect, role('admin'), getTCHistory);
router.get("/tc/history/:ipAddress", protect, role('admin'), getTCHistoryByIP);

module.exports = router;
