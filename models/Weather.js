'use strict';

const Model = require('objection').Model;

class Weather extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'weather';
  }
}

module.exports = Weather;
