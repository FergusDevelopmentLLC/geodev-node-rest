'use strict';

const Knex = require('knex');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const Model = require('objection').Model;

const Weather = require('./models/Weather');
const Fedland = require('./models/Fedland');

// Adds yield support for express router.
require('express-yields')

// Initialize knex.
const knex = Knex(knexConfig.development);

//knex-postgis
const st = require('knex-postgis')(knex);

// Bind all Models to a knex instance.
Model.knex(knex);

const app = express()
  .use(bodyParser.json())
  .set('json spaces', 2);

//Add headers to allow access to server from outside..
//https://community.c9.io/t/setting-up-blog-with-angular-error-no-access-control-allow-origin-header-is-present-on-the-requested-resource/5975
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');// Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');// Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');// Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Credentials', true);// Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  next();
});

//http://127.0.0.1:8641/weathers GET
app.get('/weathers', function* (req, res) {

  const weathers = yield Weather
    .query()
    .eager(req.query.eager)
    .skipUndefined()
    .orderBy('id')

  res.send(weathers);
});

//http://127.0.0.1:8641/weathers POST
app.post('/weathers', function* (req, res) {

  const weather = yield Weather
    .query()
    .allowInsert()
    .insertGraph(req.body);

  res.send(weather);
});

//http://127.0.0.1:8641/fedlands GET
//This will return all the fedlands from the db
app.get('/fedlands', function* (req, res) {

  const fedlands = yield Fedland
    .query()
    .eager(req.query.eager)
    .skipUndefined()
    .orderBy('id')

  res.send(fedlands);
});

//http://127.0.0.1:8641/fedlands/5761 GET (5761 is Yellowstone National Park)
app.get('/fedlands/:id', function* (req, res) {
  const fedland = yield Fedland
    .query()
    .findById(req.params.id);

  if (!fedland) {
    throwNotFound();
  }

  res.send(fedland);
});

//http://127.0.0.1:8641/fedlandsGeoJson/5761 GET (5761 is Yellowstone National Park)
app.get('/fedlandsGeoJson/:id', function* (req, res) {

  //http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

  var sql = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (";
  sql +=    "SELECT 'Feature' As type, ";
  sql +=    "	ST_AsGeoJSON(lg.geom, 4)::json As geometry,";
  sql +=    "	row_to_json(lp) AS properties ";
  sql +=    "FROM fedland AS lg ";
  sql +=    "INNER JOIN ( SELECT id, owner_code, owner, name, state, state_fips FROM fedland ) As lp ON lg.id = lp.id and lp.id = #req.params.id# ) AS f )  AS fc;";

  sql = sql.replace('#req.params.id#', req.params.id);

  const fedlandGeoJson = yield knex
  .raw(sql)

  if (!fedlandGeoJson) {
    throwNotFound();
  }

  res.send(fedlandGeoJson.rows[0].row_to_json);
});

//http://127.0.0.1:8641/fedlandsGeoJsonByOwnerCode/NPS GET (NPS is National Park Service)
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

//http://127.0.0.1:8641/fedlandsGeoJsonByOwnerCode/CO/NPS GET (CO for Colorado, NPS is National Park Service)
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

//http://127.0.0.1:8641/fedlandsOwnerCodes
app.get('/fedlandsOwnerCodes', function* (req, res) {

    const ownercodes = yield knex('fedland')
      .distinct('owner_code')
      .whereNotNull('owner_code')
      .select()

    if (!ownercodes) {
      throwNotFound();
    }
    res.send(ownercodes);
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
