const FedlandP = require('../models/fedlandP');
const Knex = require('knex');
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig.development);// Initialize knex

module.exports = {

  index: async (req, res, next) => {
    const fedlands = await FedlandP
      .query()
      .eager(req.query.eager)
      .skipUndefined()
      .orderBy('id');
    res.status(200).json(fedlands);
  },

  getFedlandP: async (req, res, next) => {
    const fedland = await FedlandP
      .query()
      .findById(req.value.params.id);
    res.status(200).json(fedland[0]);
  },

  getFedlandPForOwnerCode: async (req, res, next) => {
    var ownercode = req.value.params.ownercode;

    const fedlands = await FedlandP
      .query()
      .where('owner_code', ownercode);

    var fedlandsFC = getFeatureCollectionFor(fedlands);
    res.status(200).json(fedlandsFC);
  }

};

function getFeatureCollectionFor(coll) {

  var features = [];

  for(item in coll) {
    feature = {
      "type": "Feature",
      "geometry": {
        "type": JSON.parse(coll[item].geojson).type,
        "coordinates": JSON.parse(coll[item].geojson).coordinates
      },
      "properties": {
        "_id": coll[item]._id,
        "owner_code": coll[item].owner_code,
        "owner": coll[item].owner,
        "name": coll[item].name,
        "state": coll[item].state,
        "state_fips": coll[item].state_fips
      }
    };
    features.push(feature);
  }

  var featureCollection = {
    "type": "FeatureCollection",
    "features": features
  };

  return featureCollection;

}
