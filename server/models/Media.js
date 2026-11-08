// server/models/Media.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { transformFilter, QueryChain } = require('./modelAdapter');

const MediaModel = sequelize.define('Media', {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    defaultValue: () => crypto.randomBytes(12).toString('hex')
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'General'
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hideLevel: {
    type: DataTypes.STRING(50),
    defaultValue: 'visible'
  },
  hideReason: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  hideNote: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  hiddenBy: {
    type: DataTypes.STRING(24),
    defaultValue: null
  },
  hiddenByUsername: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  hiddenAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  scheduledHideAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  scheduledUnhideAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likedByIPs: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  user: {
    type: DataTypes.STRING(24),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  license: {
    type: DataTypes.STRING(50),
    defaultValue: 'CC-BY-4.0'
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: null
  }
}, {
  tableName: 'media',
  timestamps: true,
  getterMethods: {
    _id() {
      return this.id;
    }
  }
});

MediaModel.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values._id = this.id;
  return values;
};

MediaModel.prototype.toObject = function() {
  return this.toJSON();
};

MediaModel.prototype.markModified = function(field) {
  // no-op in Sequelize, JSON changes are tracked or re-assigned
  this.changed(field, true);
};

// Establish relation with User for populate
const UserModel = require('./User').sequelizeModel;
MediaModel.belongsTo(UserModel, { foreignKey: 'user', as: 'userInfo' });

class MediaWrapper {
  static get sequelizeModel() {
    return MediaModel;
  }

  static findOne(query) {
    return new QueryChain(MediaModel, query, true);
  }

  static findById(id) {
    return new QueryChain(MediaModel, {}, false, true, id);
  }

  static find(query = {}) {
    return new QueryChain(MediaModel, query, false);
  }

  static async create(data) {
    const record = await MediaModel.create(data);
    return record;
  }

  static countDocuments(query = {}) {
    const where = transformFilter(query);
    return MediaModel.count({ where });
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const record = await MediaModel.findByPk(id);
    if (!record) return null;

    if (update.$inc) {
      for (const [key, incVal] of Object.entries(update.$inc)) {
        record[key] = (record[key] || 0) + incVal;
      }
    }

    for (const [key, val] of Object.entries(update)) {
      if (!key.startsWith('$')) {
        record[key] = val;
      }
    }

    await record.save();
    return record;
  }

  static async findByIdAndDelete(id) {
    const record = await MediaModel.findByPk(id);
    if (record) {
      await record.destroy();
    }
    return record;
  }

  static deleteMany(query = {}) {
    const where = transformFilter(query);
    return MediaModel.destroy({ where });
  }

  static async distinct(field) {
    const records = await MediaModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col(field)), field]],
      raw: true
    });
    return records.map(r => r[field]).filter(Boolean);
  }

  static async aggregate(pipeline = []) {
    // Handle the common pipelines used in statsController
    const firstStage = pipeline[0] || {};
    if (firstStage.$group) {
      const group = firstStage.$group;
      if (group._id === null && group.total && group.total.$sum === '$size') {
        const total = await MediaModel.sum('size') || 0;
        return [{ total }];
      }
      if (group._id === '$category' && group.count && group.count.$sum === 1) {
        const records = await MediaModel.findAll({
          attributes: [
            ['category', '_id'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['category'],
          raw: true
        });
        return records.map(r => ({ _id: r._id, count: parseInt(r.count, 10) }));
      }
    }
    return [];
  }

  constructor(data) {
    return MediaModel.build(data);
  }
}

MediaWrapper.prototype = MediaModel.prototype;
module.exports = MediaWrapper;
