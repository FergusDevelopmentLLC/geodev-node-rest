const FedlandM = require('../models/fedlandM');

module.exports = {

  index: async (req, res, next) => {
    const fedlandMs = await FedlandM
      .find({});
    res.status(200).json(fedlandMs);
  },

  getFedlandM: async (req, res, next) => {
    const { fedlandmid } = req.value.params;
    const fedlandM = await FedlandM.findById(fedlandmid);
    res.status(200).json(fedlandM);
  },

  getFedlandMForOwnerCode: async (req, res, next) => {
    const ownerCode = req.params.owner_code;
    const fedlandMs = await FedlandM.where('owner_code').equals(ownerCode);
    var fedlandMsFC = getFeatureCollectionFor(fedlandMs);
    res.status(200).json(fedlandMsFC);
  }
};

function getFeatureCollectionFor(coll) {

  var features = [];

  for(item in coll) {
    feature = {
      "type": "Feature",
      "geometry": {
        "type": coll[item].geojson.type,
        "coordinates": coll[item].geojson.coordinates
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
