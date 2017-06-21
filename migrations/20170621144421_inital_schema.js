exports.up = function (knex) {
  return knex.schema
    .createTable('weather', function (table) {
      table.increments('id').primary();
      table.string('city')
      table.integer('temp_lo');
      table.integer('temp_hi');
      table.date('date');
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('weather');
};



// after running knex migrate:latest, populate weather from weather_v2

// INSERT INTO weather (city, temp_lo, temp_hi, date)
// SELECT city, temp_lo, temp_hi, date FROM weather_v2;
//
// drop table weather_v2;
