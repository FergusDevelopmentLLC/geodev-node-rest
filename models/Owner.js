'use strict';

const Model = require('objection').Model;

class Owner extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'owner';
  }
}

module.exports = Owner;
