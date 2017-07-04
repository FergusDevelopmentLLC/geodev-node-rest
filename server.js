
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');

const Model = require('objection').Model;
const knexConfig = require('./knexfile');
const Knex = require('knex');
const knex = Knex(knexConfig.development);// Initialize knex
Model.knex(knex);// Bind all Models to a knex instance.

const app = express();

app.use(express.static(__dirname + "/public")); //allows serving of static files in public folder

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());

//routes
const ownersP = require('./routes/ownersP');
const fedlandsP = require('./routes/fedlandsP');
app.use('/ownersP', ownersP);
app.use('/fedlandsP', fedlandsP);

// catch 404 and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler function
app.use((req, res, next) => {

  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  //respond to the client
  res.status(status).json({
    error: {
      message: error.message
    }
  });

  //respond to console
  console.error(err);
});

// Start the server
const server = app.listen(3000, () => {
  console.log('App listening at port %s', server.address().port);
});
