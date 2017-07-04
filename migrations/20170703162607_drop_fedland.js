
exports.up = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('fedland');
};

exports.down = function(knex, Promise) {
};
