'use strict';

const Model = require('objection').Model;

class FedlandPSBBOC extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'fedland_v2';
  }
}

module.exports = FedlandPSBBOC;
