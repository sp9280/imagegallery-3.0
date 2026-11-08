// server/models/TCAcceptance.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { transformFilter, QueryChain } = require('./modelAdapter');

const TCAcceptanceModel = sequelize.define('TCAcceptance', {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    defaultValue: () => crypto.randomBytes(12).toString('hex')
  },
  action: {
    type: DataTypes.ENUM('accept', 'reject'),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ipVersion: {
    type: DataTypes.STRING(20),
    defaultValue: null
  },
  termsAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacyAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cookiePreference: {
    type: DataTypes.ENUM('essential', 'all'),
    defaultValue: 'essential'
  },
  userAgent: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  browser: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  device: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  operatingSystem: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  referer: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  acceptLanguage: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  acceptEncoding: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  geolocation: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  clientInfo: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  acceptedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  sessionId: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  fingerprint: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'tc_acceptances',
  timestamps: true,
  getterMethods: {
    _id() {
      return this.id;
    }
  }
});

TCAcceptanceModel.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values._id = this.id;
  return values;
};

TCAcceptanceModel.prototype.toObject = function() {
  return this.toJSON();
};

class TCAcceptanceWrapper {
  static get sequelizeModel() {
    return TCAcceptanceModel;
  }

  static findOne(query) {
    return new QueryChain(TCAcceptanceModel, query, true);
  }

  static findById(id) {
    return new QueryChain(TCAcceptanceModel, {}, false, true, id);
  }

  static find(query = {}) {
    return new QueryChain(TCAcceptanceModel, query, false);
  }

  static async create(data) {
    const record = await TCAcceptanceModel.create(data);
    return record;
  }

  static countDocuments(query = {}) {
    const where = transformFilter(query);
    return TCAcceptanceModel.count({ where });
  }

  static async aggregate(pipeline = []) {
    const firstStage = pipeline[0] || {};
    if (firstStage.$group && firstStage.$group._id === '$action') {
      const records = await TCAcceptanceModel.findAll({
        attributes: [
          ['action', '_id'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['action'],
        raw: true
      });
      return records.map(r => ({ _id: r._id, count: parseInt(r.count, 10) }));
    }
    return [];
  }

  constructor(data) {
    return TCAcceptanceModel.build(data);
  }
}

TCAcceptanceWrapper.prototype = TCAcceptanceModel.prototype;
module.exports = TCAcceptanceWrapper;
