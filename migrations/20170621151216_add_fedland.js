
exports.up = function(knex, Promise) {
  return knex.schema

  /*
  CREATE TABLE fedland_v2
  (
    id integer,
    geom geometry(MultiPolygon,4326),
    owner_code character varying(7),
    owner character varying(80),
    name character varying(80),
    state character varying(14),
    state_fips character varying(14)
  )
  WITH (
    OIDS=FALSE
  );
  ALTER TABLE fedland_v2
  OWNER TO geodevdb;
  */

  .createTable('fedland', function (table) {
    table.increments('id').primary(),
    table.specificType('geom', 'geometry(MultiPolygon, 4326)'), //Add a PostGIS MultiPolygon type to table
    table.string('owner_code'),
    table.string('owner'),
    table.string('name'),
    table.string('state'),
    table.string('state_fips')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('fedland');
};

//Add a PostGIS Point type to a table in a migration:
//http://www.g9labs.com/2016/04/08/knex-dot-js-and-bookshelf-dot-js-cheat-sheet/

/*
//after running knex migrate:latest, populate fedland from fedland_v2

// INSERT INTO fedland (geom, owner_code, owner, name, state, state_fips)
// SELECT geom, owner_code, owner, name, state, state_fips FROM fedland_v2;
//
// drop table fedland_v2;
