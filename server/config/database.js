// server/config/database.js
const { Sequelize, Op } = require('sequelize');
const logger = require('./logger');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3307', 10);
const DB_NAME = process.env.DB_NAME || 'imagegallery';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : null;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    charset: 'utf8mb4'
  }
});

module.exports = {
  sequelize,
  Sequelize,
  Op
};
