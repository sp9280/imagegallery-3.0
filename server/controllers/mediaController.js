// server/controllers/mediaController.js
const authController = require('./media/authController');
const uploadController = require('./media/uploadController');
const browseController = require('./media/browseController');
const publicController = require('./media/publicController');
const adminController = require('./media/adminController');
const statsController = require('./media/statsController');

module.exports = {
  authController,
  uploadController,
  browseController,
  publicController,
  adminController,
  statsController,
};
