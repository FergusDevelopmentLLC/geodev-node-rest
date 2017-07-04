const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerMSchema = new Schema ({
  owner_code: String,
  owner: String,
  color: String,
  orderby: Number
});

const ownerM = mongoose.model('owner', ownerMSchema);
module.exports = ownerM;
