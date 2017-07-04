const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const fedlandMSchema = new Schema ({
  geojson: Object,
  owner: String,
  owner_code: String,
  name: String,
  state: String,
  state_fips: String
});

const fedlandM = mongoose.model('fedland', fedlandMSchema);
module.exports = fedlandM;
