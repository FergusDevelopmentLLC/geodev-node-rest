'use strict';

const Knex = require('knex');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const Model = require('objection').Model;
const path = require('path');

const Weather = require('./models/Weather');
const Fedland = require('./models/Fedland');
const Owner = require('./models/Owner');

// Adds yield support for express router.
// https://www.npmjs.com/package/express-yields
// this is why some app.gets below have function*
require('express-yields');

const knex = Knex(knexConfig.development);// Initialize knex

const st = require('knex-postgis')(knex);//knex-postgis

const app = express()
  .use(bodyParser.json())
  .set('json spaces', 2);

Model.knex(knex);// Bind all Models to a knex instance.

app.get('/', function (req, res) {
  res.sendFile(path.resolve('index.html'));
});

app.get('/data/owners.json', function (req, res) {
  res.sendFile(path.resolve('data/owners.json'));
});

app.get('/data/owners.json', function (req, res) {
  res.sendFile(path.resolve('data/owners.json'));
});

app.get('/data/fedland_geojson.tar.gz', function (req, res) {
  res.sendFile(path.resolve('data/fedland_geojson.tar.gz'));
});

app.get('/owners', function* (req, res) {

  const owners = yield Owner
    .query()
    .eager(req.query.eager)
    .skipUndefined()
    .orderBy('orderby')

  res.send(owners);
});

app.get('/data/BLM.geojson', function (req, res) {
  res.sendFile(path.resolve('data/BLM.geojson'));
});
app.get('/data/BOR.geojson', function (req, res) {
  res.sendFile(path.resolve('data/BOR.geojson'));
});
app.get('/data/DOD.geojson', function (req, res) {
  res.sendFile(path.resolve('data/DOD.geojson'));
});
app.get('/data/FS.geojson', function (req, res) {
  res.sendFile(path.resolve('data/FS.geojson'));
});
app.get('/data/FWS.geojson', function (req, res) {
  res.sendFile(path.resolve('data/FWS.geojson'));
});
app.get('/data/NPS.geojson', function (req, res) {
  res.sendFile(path.resolve('data/NPS.geojson'));
});
app.get('/data/PRI.geojson', function (req, res) {
  res.sendFile(path.resolve('data/PRI.geojson'));
});
app.get('/data/TVA.geojson', function (req, res) {
  res.sendFile(path.resolve('data/TVA.geojson'));
});

app.get('/fedlands', function* (req, res) {

  const fedlands = yield Fedland
    .query()
    .eager(req.query.eager)
    .skipUndefined()
    .orderBy('id')

  res.send(fedlands);
});

app.get('/fedlands/:id', function* (req, res) {
  const fedland = yield Fedland
    .query()
    .findById(req.params.id);

  if (!fedland) {
    throwNotFound();
  }
  res.send(fedland);
});

app.get('/fedlandsGeoJson/:id', function* (req, res) {
  //better way?
  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, 4)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and lp.id = #req.params.id# ) AS f )  AS fc;";
  sql = sql.replace('#req.params.id#', req.params.id); //better way?

  const fedlandGeoJson = yield knex
    .raw(sql);

  if (!fedlandGeoJson) {
    throwNotFound();
  };

  res.send(fedlandGeoJson.rows[0].row_to_json);
  //http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

});

app.get('/fedlandsGeoJsonByOwnerCode/:owner_code', function* (req, res) {

  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, 4)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and lp.owner_code = '#req.params.owner_code#' ) AS f )  AS fc;";

  sql = sql.replace('#req.params.owner_code#', req.params.owner_code);

  const fedlandsGeoJsonByOwnerCode = yield knex
    .raw(sql)

    if (!fedlandsGeoJsonByOwnerCode) {
      throwNotFound();
    }

    res.send(fedlandsGeoJsonByOwnerCode.rows[0].row_to_json);
});

app.get('/fedlandsGeoJsonByStateOwnerCode/:state/:owner_code', function* (req, res) {

  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, 4)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and lp.owner_code = '#req.params.owner_code#' and lp.state = '#req.params.state#' ) AS f )  AS fc;";

  sql = sql.replace('#req.params.owner_code#', req.params.owner_code);
  sql = sql.replace('#req.params.state#', req.params.state);

  const fedlandsGeoJsonByStateOwnerCode = yield knex
    .raw(sql)

    if (!fedlandsGeoJsonByStateOwnerCode) {
      throwNotFound();
    }

    res.send(fedlandsGeoJsonByStateOwnerCode.rows[0].row_to_json);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

const server = app.listen(8641, () => {
  console.log('App listening at port %s', server.address().port);
});
