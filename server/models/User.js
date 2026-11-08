// server/models/User.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { transformFilter, QueryChain } = require('./modelAdapter');

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    defaultValue: () => crypto.randomBytes(12).toString('hex')
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'moderator', 'coadmin', 'admin', 'owner'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  emailVerificationCode: {
    type: DataTypes.STRING(10),
    defaultValue: null
  },
  emailVerificationExpires: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phoneNumber: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  secondaryEmail: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  nickname: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  yearOfStudy: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  stream: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  joiningDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  getterMethods: {
    _id() {
      return this.id;
    }
  }
});

UserModel.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values._id = this.id;
  return values;
};

UserModel.prototype.toObject = function() {
  return this.toJSON();
};

// Compatibility wrapper
class UserWrapper {
  static get sequelizeModel() {
    return UserModel;
  }

  static findOne(query) {
    return new QueryChain(UserModel, query, true);
  }

  static findById(id) {
    return new QueryChain(UserModel, {}, false, true, id);
  }

  static find(query = {}) {
    return new QueryChain(UserModel, query, false);
  }

  static async create(data) {
    const record = await UserModel.create(data);
    return record;
  }

  static countDocuments(query = {}) {
    const where = transformFilter(query);
    return UserModel.count({ where });
  }

  static async findByIdAndDelete(id) {
    const record = await UserModel.findByPk(id);
    if (record) {
      await record.destroy();
    }
    return record;
  }

  static deleteMany(query = {}) {
    const where = transformFilter(query);
    return UserModel.destroy({ where });
  }

  constructor(data) {
    return UserModel.build(data);
  }
}

UserWrapper.prototype = UserModel.prototype;
module.exports = UserWrapper;
