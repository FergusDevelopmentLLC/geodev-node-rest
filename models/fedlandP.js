'use strict';

const Model = require('objection').Model;

class FedlandP extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'fedland';
  }
}

module.exports = FedlandP;
