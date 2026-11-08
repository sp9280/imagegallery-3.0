// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

logger.info(`====================================================`);
logger.info(`🚀 Starting ImageGallery 3.0 Server Initialization`);
logger.info(`🕒 Start Time: ${new Date().toISOString()}`);
logger.info(`💻 Node Version: ${process.version} | Platform: ${process.platform}`);
logger.info(`====================================================`);

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: true, // Allow all origins (or specify your network IP)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id', 'x-client-id', 'x-mac-address']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Detailed HTTP Request Logging from Start to End
app.use((req, res, next) => {
  const start = Date.now();
  const clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || '127.0.0.1';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMsg = `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms) - IP: ${clientIP}`;
    if (res.statusCode >= 500) {
      logger.error(logMsg);
    } else if (res.statusCode >= 400) {
      logger.warn(logMsg);
    } else {
      logger.info(logMsg);
    }
  });

  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Visitor tracking middleware
const { trackVisitor } = require("./middleware/visitorTracker");
app.use(trackVisitor);

// Routes
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("Image Gallery API Running"));

// Catch 404 routes
app.use((req, res, next) => {
  logger.warn(`[404 NOT FOUND] ${req.method} ${req.originalUrl} - IP: ${req.ip || '127.0.0.1'}`);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use(errorHandler);

// Global process exception & termination logging (Start to End lifecycle)
process.on('uncaughtException', (err) => {
  logger.error(`[UNCAUGHT EXCEPTION] ${err.message}`, { stack: err.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[UNHANDLED REJECTION] Reason: ${reason}`);
});

process.on('SIGTERM', () => {
  logger.info(`🛑 SIGTERM signal received. Shutting down gracefully...`);
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info(`🛑 SIGINT (Ctrl+C) received. Server stopped.`);
  process.exit(0);
});

// Bind to 0.0.0.0 to allow connections from all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`🌐 Access from other devices: http://YOUR_IP:${PORT}`);
});
