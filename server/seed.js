// server/seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const Media = require('./models/Media');
const logger = require('./config/logger');

async function seed() {
  await connectDB();

  // 1. Ensure Admin User
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });
    logger.info('Created default admin: admin@example.com / Admin@123');
  }

  // 2. Ensure Regular User
  let user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    const hashedPassword = await bcrypt.hash('User@123', 10);
    user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isEmailVerified: true
    });
    logger.info('Created default user: user@example.com / User@123');
  }

  // 3. Seed uploads if Media table is empty
  const mediaCount = await Media.countDocuments();
  if (mediaCount === 0) {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
      const categories = ['General', 'Nature', 'Architecture', 'Art'];
      let idx = 0;
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        await Media.create({
          title: `Sample Gallery Image ${idx + 1}`,
          description: 'A beautiful gallery image',
          category: categories[idx % categories.length],
          filename: file,
          originalName: file,
          mimetype: 'image/jpeg',
          size: stats.size,
          url: `/uploads/${file}`,
          user: admin.id,
          tags: ['gallery', 'sample', 'photography'],
          license: 'CC-BY-4.0',
          isPublic: true,
          isHidden: false,
          likes: 0,
          downloads: 0,
          views: 0
        });
        idx++;
      }
      logger.info(`Seeded ${idx} sample media items from uploads folder`);
    }
  }

  logger.info('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  logger.error('Seed error:', err);
  process.exit(1);
});

