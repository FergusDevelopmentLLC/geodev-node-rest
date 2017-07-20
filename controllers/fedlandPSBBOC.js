const FedlandPSBBOC = require('../models/fedlandPSBBOC');
const Knex = require('knex');
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig.development);// Initialize knex

module.exports = {

  getFedlandPSBBOC: async (req, res, next) => {

    // {
    // 	"owner_code" : "NPS",
    // 	"left_lng" : -109.044926,
    // 	"bottom_lat" : 36.999016,
    // 	"right_lng" : -102.051515,
    // 	"top_lat" : 41.001666,
    // 	"simplification" : 0.001,
    // 	"geojson_digits" : 3,
    // 	"srid" : 4326
    // }

    const owner_code = req.body.owner_code;
    const left_lng = req.body.left_lng;
    const bottom_lat = req.body.bottom_lat;
    const right_lng = req.body.right_lng;
    const top_lat = req.body.top_lat;
    const simplification = req.body.simplification;
    const geojson_digits = req.body.geojson_digits;
    const srid = req.body.srid;

    //1.0 to 0.001, simple to complex
    // ST_MakeEnvelope(left, bottom, right, top, srid)
    // ST_MakeEnvelope(LON1, LAT1, LON2, LAT2, 4326)

    var   sql =  " select id, ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom, " + simplification + "), " + geojson_digits + ") as geojson, owner, owner_code, name, state, state_fips ";
          sql += " from fedland_postgis ";
          sql += " where owner_code = '" + owner_code + "' ";
          sql += " AND ST_SimplifyPreserveTopology(geom, " + simplification + ") && ST_MakeEnvelope(" + left_lng + ", " + bottom_lat + ", " + right_lng + ", " + top_lat + ", " + srid + "); ";

    // console.log("========");
    // console.log(sql);
    // console.log("========");

    const result = await knex.raw(sql);
    const fedlands = [];
    for(var feature in result.rows) {
      fedlands[feature] = result.rows[feature];
    }

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
