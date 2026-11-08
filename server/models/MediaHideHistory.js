// server/models/MediaHideHistory.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { transformFilter, QueryChain } = require('./modelAdapter');

const MediaHideHistoryModel = sequelize.define('MediaHideHistory', {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    defaultValue: () => crypto.randomBytes(12).toString('hex')
  },
  mediaId: {
    type: DataTypes.STRING(24),
    allowNull: false
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  hideLevel: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  note: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  performedBy: {
    type: DataTypes.STRING(24),
    allowNull: false
  },
  performedByRole: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  performedByUsername: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  userAgent: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  previousState: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  newState: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  scheduledHideAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  scheduledUnhideAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'media_hide_histories',
  timestamps: true,
  getterMethods: {
    _id() {
      return this.id;
    }
  }
});

MediaHideHistoryModel.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values._id = this.id;
  return values;
};

MediaHideHistoryModel.prototype.toObject = function() {
  return this.toJSON();
};

const UserModel = require('./User').sequelizeModel;
MediaHideHistoryModel.belongsTo(UserModel, { foreignKey: 'performedBy', as: 'performedByUser' });

class MediaHideHistoryWrapper {
  static get sequelizeModel() {
    return MediaHideHistoryModel;
  }

  static findOne(query) {
    return new QueryChain(MediaHideHistoryModel, query, true);
  }

  static findById(id) {
    return new QueryChain(MediaHideHistoryModel, {}, false, true, id);
  }

  static find(query = {}) {
    return new QueryChain(MediaHideHistoryModel, query, false);
  }

  static async create(data) {
    const record = await MediaHideHistoryModel.create(data);
    return record;
  }

  static countDocuments(query = {}) {
    const where = transformFilter(query);
    return MediaHideHistoryModel.count({ where });
  }

  constructor(data) {
    return MediaHideHistoryModel.build(data);
  }
}

MediaHideHistoryWrapper.prototype = MediaHideHistoryModel.prototype;
module.exports = MediaHideHistoryWrapper;
