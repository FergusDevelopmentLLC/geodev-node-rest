
exports.up = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('weather');
};

exports.down = function(knex, Promise) {

};
