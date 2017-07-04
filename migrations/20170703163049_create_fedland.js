
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('fedland', function (table) {
      table.increments('id').primary();
      table.text('geojson');
      table.string('owner');
      table.string('owner_code');
      table.string('name');
      table.string('state');
      table.string('state_fips');
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('fedland');
};
