// server/config/db.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { sequelize } = require('./database');
const mysql = require('mysql2/promise');
const { spawn } = require('child_process');
const fs = require('fs');
const logger = require('./logger');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || 'imagegallery';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : null;
const MYSQLD_PATH = process.env.MYSQLD_PATH || '';
const DB_DATA_DIR = process.env.DB_DATA_DIR || path.resolve(__dirname, '../data');

async function ensureMysqldRunning() {
  if (MYSQLD_PATH && fs.existsSync(MYSQLD_PATH) && fs.existsSync(DB_DATA_DIR)) {
    logger.info(`Starting local MySQL/MariaDB server on port ${DB_PORT}...`);
    const child = spawn(MYSQLD_PATH, [`--datadir=${DB_DATA_DIR}`, `--port=${DB_PORT}`], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    await new Promise(resolve => setTimeout(resolve, 2500));
  }
}

const connectDB = async () => {
  try {
    // 1. Ensure database exists (with auto-start if server binary is configured)
    const connConfig = {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER
    };
    if (DB_PASSWORD !== null && DB_PASSWORD !== undefined) {
      connConfig.password = DB_PASSWORD;
    }

    let connection;
    try {
      connection = await mysql.createConnection(connConfig);
    } catch (connectErr) {
      if (connectErr.code === 'ECONNREFUSED' || connectErr.message?.includes('ECONNREFUSED')) {
        await ensureMysqldRunning();
        try {
          connection = await mysql.createConnection(connConfig);
        } catch (retryErr) {
          logger.warn('Retry connecting to MySQL:', retryErr.message);
        }
      }
    }

    if (connection) {
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
      await connection.end();
    }

    // 2. Connect via Sequelize
    await sequelize.authenticate();
    logger.info(`MySQL/MariaDB connected successfully to database: ${DB_NAME} on port ${DB_PORT}`);

    // Load models to register associations
    require('../models/User');
    require('../models/Media');
    require('../models/MediaHideHistory');
    require('../models/TCAcceptance');
    require('../models/Visitor');

    // 3. Sync tables
    await sequelize.sync({ alter: false });
    logger.info('MySQL/MariaDB tables synchronized successfully');
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
