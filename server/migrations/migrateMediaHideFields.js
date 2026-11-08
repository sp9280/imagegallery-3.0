/**
 * Migration Script: Update existing hidden media with new hide level fields
 * 
 * Run this once after deploying the hide/unhide enhancements to update
 * any existing hidden media with the new hideLevel field.
 * 
 * Usage:
 *   node server/migrations/migrateMediaHideFields.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imagegallery';

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const mediaCollection = db.collection('media');

    console.log('\n📊 Checking existing media...');
    
    // Count total media
    const totalMedia = await mediaCollection.countDocuments();
    console.log(`Total media items: ${totalMedia}`);

    // Count hidden media without hideLevel
    const hiddenWithoutLevel = await mediaCollection.countDocuments({
      isHidden: true,
      hideLevel: { $exists: false }
    });
    console.log(`Hidden media without hideLevel: ${hiddenWithoutLevel}`);

    if (hiddenWithoutLevel === 0) {
      console.log('\n✅ No migration needed. All hidden media already have hideLevel field.');
      await mongoose.connection.close();
      return;
    }

    console.log('\n🔧 Starting migration...');

    // Update hidden media to have hideLevel = 'hard_hide' (default)
    const result = await mediaCollection.updateMany(
      {
        isHidden: true,
        hideLevel: { $exists: false }
      },
      {
        $set: {
          hideLevel: 'hard_hide',
          hideReason: 'Migrated from legacy hide field',
          hideNote: 'Automatically migrated during system upgrade'
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} hidden media items`);

    // Update visible media to have hideLevel = 'visible'
    const visibleResult = await mediaCollection.updateMany(
      {
        $or: [
          { isHidden: false },
          { isHidden: { $exists: false } }
        ],
        hideLevel: { $exists: false }
      },
      {
        $set: {
          hideLevel: 'visible'
        }
      }
    );

    console.log(`✅ Updated ${visibleResult.modifiedCount} visible media items`);

    // Show final stats
    console.log('\n📊 Final Statistics:');
    const stats = {
      visible: await mediaCollection.countDocuments({ hideLevel: 'visible' }),
      soft_hide: await mediaCollection.countDocuments({ hideLevel: 'soft_hide' }),
      hard_hide: await mediaCollection.countDocuments({ hideLevel: 'hard_hide' }),
      archived: await mediaCollection.countDocuments({ hideLevel: 'archived' })
    };

    console.log('Hide Level Distribution:');
    console.log(`  👁️  Visible: ${stats.visible}`);
    console.log(`  🟡 Soft Hide: ${stats.soft_hide}`);
    console.log(`  🟠 Hard Hide: ${stats.hard_hide}`);
    console.log(`  🔴 Archived: ${stats.archived}`);

    console.log('\n✨ Migration completed successfully!');
    console.log('📝 Note: History records were not created for pre-existing hidden media.');
    console.log('    Only future hide/unhide actions will be tracked in MediaHideHistory.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
migrate();