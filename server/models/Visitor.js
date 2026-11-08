// server/models/Visitor.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { transformFilter, QueryChain } = require('./modelAdapter');

const VisitorModel = sequelize.define('Visitor', {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    defaultValue: () => crypto.randomBytes(12).toString('hex')
  },
  ipAddress: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  visitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  firstVisit: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastVisit: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  hasAcceptedTerms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  termsAcceptedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  userAgent: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: null
  }
}, {
  tableName: 'visitors',
  timestamps: true,
  getterMethods: {
    _id() {
      return this.id;
    }
  }
});

VisitorModel.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values._id = this.id;
  return values;
};

VisitorModel.prototype.toObject = function() {
  return this.toJSON();
};

VisitorModel.prototype.recordVisit = async function() {
  this.visitCount += 1;
  this.lastVisit = new Date();
  return this.save();
};

VisitorModel.prototype.acceptTerms = async function() {
  this.hasAcceptedTerms = true;
  this.termsAcceptedAt = new Date();
  return this.save();
};

class VisitorWrapper {
  static get sequelizeModel() {
    return VisitorModel;
  }

  static findOne(query) {
    return new QueryChain(VisitorModel, query, true);
  }

  static findById(id) {
    return new QueryChain(VisitorModel, {}, false, true, id);
  }

  static find(query = {}) {
    return new QueryChain(VisitorModel, query, false);
  }

  static async create(data) {
    const record = await VisitorModel.create(data);
    return record;
  }

  static countDocuments(query = {}) {
    const where = transformFilter(query);
    return VisitorModel.count({ where });
  }

  static async aggregate(pipeline = []) {
    const firstStage = pipeline[0] || {};
    if (firstStage.$group && firstStage.$group._id === null && firstStage.$group.total && firstStage.$group.total.$sum === '$visitCount') {
      const total = await VisitorModel.sum('visitCount') || 0;
      return [{ total }];
    }
    return [];
  }

  constructor(data) {
    return VisitorModel.build(data);
  }
}

VisitorWrapper.prototype = VisitorModel.prototype;
module.exports = VisitorWrapper;
