/**
 * Migration Script for TCAcceptance Collection
 * 
 * This script removes the unique constraint on ipAddress field
 * to allow multiple acceptance/rejection records per IP address.
 * 
 * Run this ONCE after updating the model to ensure MongoDB removes
 * the old unique index.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imagegallery';

async function migrateTCAcceptance() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('tcacceptances');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'tcacceptances' }).toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  Collection "tcacceptances" does not exist yet. No migration needed.');
      console.log('✅ Migration complete - collection will be created with new schema.');
      await mongoose.connection.close();
      return;
    }

    console.log('📋 Listing current indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Find and drop the unique index on ipAddress
    const uniqueIpIndex = indexes.find(idx => 
      idx.unique && idx.key.ipAddress === 1
    );

    if (uniqueIpIndex) {
      console.log(`🗑️  Dropping unique index on ipAddress: ${uniqueIpIndex.name}`);
      await collection.dropIndex(uniqueIpIndex.name);
      console.log('✅ Unique index dropped successfully');
    } else {
      console.log('ℹ️  No unique index found on ipAddress field');
    }

    // Create new indexes
    console.log('📊 Creating new indexes...');
    
    // Index for ipAddress (non-unique) + createdAt
    await collection.createIndex({ ipAddress: 1, createdAt: -1 });
    console.log('✅ Created index: { ipAddress: 1, createdAt: -1 }');
    
    // Index for action + createdAt
    await collection.createIndex({ action: 1, createdAt: -1 });
    console.log('✅ Created index: { action: 1, createdAt: -1 }');
    
    // Index for action field alone
    await collection.createIndex({ action: 1 });
    console.log('✅ Created index: { action: 1 }');
    
    // Index for acceptedAt
    await collection.createIndex({ acceptedAt: 1 });
    console.log('✅ Created index: { acceptedAt: 1 }');

    console.log('\n📋 Listing updated indexes...');
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', JSON.stringify(updatedIndexes, null, 2));

    // Get collection stats
    const count = await collection.countDocuments();
    console.log(`\n📊 Collection stats: ${count} documents`);

    console.log('\n✅ Migration completed successfully!');
    console.log('\nℹ️  Note: Existing documents will now allow duplicate IP addresses.');
    console.log('ℹ️  Each new acceptance/rejection will create a new document.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateTCAcceptance()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });