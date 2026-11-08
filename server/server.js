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
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

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

// Error handling middleware
app.use(errorHandler);

// Bind to 0.0.0.0 to allow connections from all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`🌐 Access from other devices: http://YOUR_IP:${PORT}`);
});
