'use strict';

const Knex = require('knex');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const fs = require("fs");

const knexConfig = require('./knexfile');
const Model = require('objection').Model;

const Weather = require('./models/Weather');
const Fedland = require('./models/Fedland');
const Owner = require('./models/Owner');
const ey = require('express-yields')// Adds yield support for express router.

const asGeoJsonPrec = 3;//default number of places for AsGeoJson, lower number, less data, faster load time. Don't go above 15
const knex = Knex(knexConfig.development);// Initialize knex.
const st = require('knex-postgis')(knex);//knex-postgis

const de = require('dotenv');
de.config();

//console.log(process.env);
//console.log(process.env.PROD_DB_HOST);

const app = express()
  .use(bodyParser.json())
  .set('json spaces', 2);

Model.knex(knex);// Bind all Models to a knex instance.

app.get('/', function* (req, res) {
  var html = fs.readFileSync("index.html", "utf8");
  res.write(html);
  res.end();
});

app.get('/owners', function* (req, res) {

    const owners = yield knex('owner')
      .select()
      .orderBy('orderby')

    if (!owners) {
      throwNotFound();
    }

    res.send(owners);
});
// app.post('/owners', function* (req, res) {
//
//   const owners = yield Owner
//     .query()
//     .allowInsert()
//     .insertGraph(req.body);
//
//   res.send(owner);
// });
//app.patch('/owners/:id', function* (req, res) {
//   const owner = yield Owner
//     .query()
//     .patchAndFetchById(req.params.id, req.body);
//
//   res.send(owner);
// });
//app.delete('/owners/:id', function* (req, res) {
//   const owner = yield Owner
//     .query()
//     .deleteById(req.params.id);
//
//   res.send({});
// });
app.get('/data/owners.json', function* (req, res) {
  var json = fs.readFileSync("data/owners.json", "utf8");
  res.write(json);
  res.end();
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

  //http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, #asGeoJsonPrec#)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and ";
  sql +=    "lp.id = #req.params.id# ) AS f ) AS fc;";

  sql = sql.replace('#asGeoJsonPrec#', asGeoJsonPrec);
  sql = sql.replace('#req.params.id#', req.params.id);

  const fedlandGeoJson = yield knex
  .raw(sql)

  if (!fedlandGeoJson) {
    throwNotFound();
  }

  res.send(fedlandGeoJson.rows[0].row_to_json);
});
app.get('/fedlandsGeoJsonByOwnerCode/:owner_code', function* (req, res) {

  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, #asGeoJsonPrec#)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and ";
  sql +=    "lp.owner_code = '#req.params.owner_code#' ) AS f ) AS fc;";

  sql = sql.replace('#asGeoJsonPrec#', asGeoJsonPrec);
  sql = sql.replace('#req.params.owner_code#', req.params.owner_code);

  const fedlandsGeoJsonByOwnerCode = yield knex
    .raw(sql)

    if (!fedlandsGeoJsonByOwnerCode) {
      throwNotFound();
    }

    res.send(fedlandsGeoJsonByOwnerCode.rows[0].row_to_json);
});

app.get('/data/NPS.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/NPS.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/BLM.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/BLM.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/DOD.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/DOD.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/FS.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/FS.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/FWS.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/FWS.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/PRI.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/PRI.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/BOR.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/BOR.geojson", "utf8");
  res.write(geojson);
  res.end();
});
app.get('/data/TVA.geojson', function* (req, res) {
  var geojson = fs.readFileSync("data/TVA.geojson", "utf8");
  res.write(geojson);
  res.end();
});

// Error handling.
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
