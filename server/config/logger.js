// server/config/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom readable log line format for files and console
const readableFormat = format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const errorStack = stack ? `\n[STACK]: ${stack}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}${errorStack}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true })
  ),
  transports: [
    // 1. Error Log - records all errors, warnings, stack traces
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: format.combine(readableFormat),
      maxsize: 20 * 1024 * 1024, // 20MB
      maxFiles: 10
    }),

    // 2. Combined Log - records everything from start to end (requests, database, events)
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: format.combine(readableFormat),
      maxsize: 30 * 1024 * 1024, // 30MB
      maxFiles: 10
    }),

    // 3. Fallback root logs for backwards compatibility
    new transports.File({
      filename: path.resolve(__dirname, '../error.log'),
      level: 'error',
      format: format.combine(readableFormat),
      maxsize: 15 * 1024 * 1024,
      maxFiles: 5
    }),
    new transports.File({
      filename: path.resolve(__dirname, '../combined.log'),
      format: format.combine(readableFormat),
      maxsize: 25 * 1024 * 1024,
      maxFiles: 5
    })
  ],
  // Capture unhandled rejections and uncaught exceptions
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
    new transports.File({ filename: path.resolve(__dirname, '../error.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') }),
    new transports.File({ filename: path.resolve(__dirname, '../error.log') })
  ]
});

// Always output readable colored logs to console
logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'HH:mm:ss' }),
    readableFormat
  )
}));

module.exports = logger;
