// server/controllers/media/authController.js
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const winston = require("winston");

// Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const jwtSecret = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRY = "1d";

// ✅ Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(409).json({ message: "User with this email or username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      username,
      email,
      password: hashed,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false
    });

    // Send verification email
    const { sendVerificationEmail } = require('../../services/mailService');
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      logger.warn(`Failed to send verification email to ${email}: ${emailResult.error}`);
      // Continue with registration even if email fails
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: JWT_EXPIRY });

    logger.info(`New user registered: ${username}`);
    res.status(201).json({
      status: "success",
      message: "Registration successful. Please check your email for verification code.",
      data: {
        token,
        user: {
          _id: user._id,
          username,
          email,
          role: user.role,
          isEmailVerified: false
        }
      },
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "Email/username and password required" });

    const trimmedIdentifier = identifier.trim();

    // Query by email (case-insensitive) or username
    const user = await User.findOne({
      $or: [{ email: trimmedIdentifier.toLowerCase() }, { username: trimmedIdentifier }],
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLogin = new Date();
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: JWT_EXPIRY });
    logger.info(`User logged in: ${user.username}`);

    res.json({
      status: "success",
      data: {
        token,
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and verification code are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    if (!user.emailVerificationCode || !user.emailVerificationExpires)
      return res.status(400).json({ message: "No verification code found. Please register again." });

    if (user.emailVerificationExpires < new Date())
      return res.status(400).json({ message: "Verification code has expired. Please register again." });

    if (user.emailVerificationCode !== code)
      return res.status(400).json({ message: "Invalid verification code" });

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    logger.info(`Email verified for user: ${user.username}`);
    res.json({
      status: "success",
      message: "Email verified successfully",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: true
        }
      }
    });
  } catch (err) {
    logger.error(`Email verification error: ${err.message}`);
    res.status(500).json({ message: "Email verification failed" });
  }
};
