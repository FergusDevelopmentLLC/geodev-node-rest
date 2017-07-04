
exports.up = function(knex, Promise) {
  return knex.schema
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
