// server/models/modelAdapter.js
const { Op } = require('sequelize');

function transformFilter(query = {}) {
  if (!query || typeof query !== 'object') return {};
  const transformed = {};

  for (const [key, val] of Object.entries(query)) {
    if (key === '_id') {
      transformed.id = val;
    } else if (key === '$or' && Array.isArray(val)) {
      transformed[Op.or] = val.map(transformFilter);
    } else if (key === '$and' && Array.isArray(val)) {
      transformed[Op.and] = val.map(transformFilter);
    } else if (val && typeof val === 'object' && val.$regex !== undefined) {
      transformed[key] = { [Op.like]: `%${val.$regex}%` };
    } else if (val && typeof val === 'object' && val.$options !== undefined && val.$regex === undefined) {
      // ignore pure $options
    } else if (val && typeof val === 'object' && val.$in !== undefined) {
      transformed[key] = { [Op.in]: val.$in };
    } else if (val && typeof val === 'object' && val.$nin !== undefined) {
      transformed[key] = { [Op.notIn]: val.$nin };
    } else if (val && typeof val === 'object' && val.$ne !== undefined) {
      transformed[key] = { [Op.ne]: val.$ne };
    } else {
      transformed[key] = val;
    }
  }

  return transformed;
}

function transformSort(sortInput) {
  if (!sortInput) return [['createdAt', 'DESC']];
  if (Array.isArray(sortInput)) return sortInput;
  if (typeof sortInput === 'string') {
    const parts = sortInput.trim().split(/\s+/);
    return parts.map(p => {
      if (p.startsWith('-')) return [p.slice(1), 'DESC'];
      return [p, 'ASC'];
    });
  }
  if (typeof sortInput === 'object') {
    return Object.entries(sortInput).map(([col, order]) => {
      const dir = (order === -1 || order === 'desc' || order === 'DESC') ? 'DESC' : 'ASC';
      return [col, dir];
    });
  }
  return [['createdAt', 'DESC']];
}

function sanitizeAttributes(fields) {
  if (!fields) return undefined;
  const set = new Set();
  for (const f of fields) {
    if (f === '_id' || f === 'id') {
      set.add('id');
    } else {
      set.add(f);
    }
  }
  return Array.from(set);
}

function postProcessRecord(record) {
  if (!record) return record;

  if (record.userInfo) {
    const u = typeof record.userInfo.toJSON === 'function' ? record.userInfo.toJSON() : record.userInfo;
    u._id = u.id;
    record.setDataValue ? record.setDataValue('user', u) : (record.user = u);
  }
  if (record.performedByUser) {
    const p = typeof record.performedByUser.toJSON === 'function' ? record.performedByUser.toJSON() : record.performedByUser;
    p._id = p.id;
    record.setDataValue ? record.setDataValue('performedBy', p) : (record.performedBy = p);
  }

  return record;
}

class QueryChain {
  constructor(model, filter = {}, isFindOne = false, isFindById = false, id = null) {
    this.model = model;
    this.filter = transformFilter(filter);
    this.isFindOne = isFindOne;
    this.isFindById = isFindById;
    this.id = id;
    this._limit = null;
    this._offset = null;
    this._order = null;
    this._attributes = null;
    this._include = [];
  }

  populate(field, select) {
    if (field === 'user' || field.startsWith('user')) {
      const User = require('./User');
      let attributes;
      if (select) {
        const rawFields = select.split(' ').map(s => s.trim()).filter(Boolean);
        attributes = sanitizeAttributes(rawFields);
      } else {
        attributes = ['id', 'username', 'email'];
      }
      this._include.push({
        model: User.sequelizeModel,
        as: 'userInfo',
        attributes
      });
    } else if (field === 'performedBy') {
      const User = require('./User');
      let attributes;
      if (select) {
        const rawFields = select.split(' ').map(s => s.trim()).filter(Boolean);
        attributes = sanitizeAttributes(rawFields);
      } else {
        attributes = ['id', 'username', 'email'];
      }
      this._include.push({
        model: User.sequelizeModel,
        as: 'performedByUser',
        attributes
      });
    }
    return this;
  }

  sort(sortInput) {
    this._order = transformSort(sortInput);
    return this;
  }

  limit(num) {
    this._limit = parseInt(num, 10);
    return this;
  }

  skip(num) {
    this._offset = parseInt(num, 10);
    return this;
  }

  select(selectInput) {
    if (!selectInput) return this;
    if (typeof selectInput === 'string') {
      const fields = selectInput.split(' ').map(f => f.trim()).filter(Boolean);
      const exclude = fields.filter(f => f.startsWith('-')).map(f => f.slice(1));
      const explicitInclude = fields.filter(f => f.startsWith('+')).map(f => f.slice(1));
      const normalInclude = fields.filter(f => !f.startsWith('-') && !f.startsWith('+'));

      if (exclude.length > 0) {
        this._attributes = { exclude };
      } else if (normalInclude.length > 0) {
        this._attributes = sanitizeAttributes([...normalInclude, ...explicitInclude]);
      } else if (explicitInclude.length > 0) {
        // If only +field was requested (e.g. select("+password")),
        // do not restrict attributes so all default model attributes (including password) are loaded.
        this._attributes = null;
      }
    }
    return this;
  }

  lean() {
    return this;
  }

  async exec() {
    const options = {};
    if (this._attributes) options.attributes = this._attributes;
    if (this._include.length > 0) options.include = this._include;

    if (this.isFindById) {
      const record = await this.model.findByPk(this.id, options);
      return postProcessRecord(record);
    }

    if (this.isFindOne) {
      options.where = this.filter;
      if (this._order) options.order = this._order;
      const record = await this.model.findOne(options);
      return postProcessRecord(record);
    }

    options.where = this.filter;
    if (this._order) options.order = this._order;
    if (this._limit !== null && !isNaN(this._limit)) options.limit = this._limit;
    if (this._offset !== null && !isNaN(this._offset)) options.offset = this._offset;

    const records = await this.model.findAll(options);
    return records.map(postProcessRecord);
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.exec().catch(onRejected);
  }
}

module.exports = {
  transformFilter,
  transformSort,
  QueryChain
};
