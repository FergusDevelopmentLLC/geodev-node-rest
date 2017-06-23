
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('owner', function (table) {
      table.increments('id').primary(),
      table.string('owner_code'),
      table.string('owner'),
      table.string('color')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('owner');
};

// {
//     "id": 1,
//     "owner_code": "BOR",
//     "owner": "Bureau of Reclamation",
//     "color": "#9f4fdb",
//     "orderby": 1
// },
// {
//     "id": 2,
//     "owner_code": "BLM",
//     "owner": "Bureau of Land Management",
//     "color": "#c23d99",
//     "orderby": 2
// },
// {
//     "id": 3,
//     "owner_code": "DOD",
//     "owner": "Department of Defense",
//     "color": "#003049",
//     "orderby": 3
// },
// {
//     "id": 4,
//     "owner_code": "FWS",
//     "owner": "Fish and Wildlife Service",
//     "color": "#0b6f94",
//     "orderby": 4
// },
// {
//     "id": 5,
//     "owner_code": "FS",
//     "owner": "Forest Service",
//     "color": "#CE6A46",
//     "orderby": 5
// },
// {
//     "id": 6,
//     "owner_code": "NPS",
//     "owner": "National Park Service",
//     "color": "#3f9233",
//     "orderby": 6
// },
// {
//     "id": 8,
//     "owner_code": "TVA",
//     "owner": "Tennessee Valley Authority",
//     "color": "#773344",
//     "orderby": 7
// },
// {
//     "id": 7,
//     "owner_code": "PRI",
//     "owner": "State/Private",
//     "color": "#6B6558",
//     "orderby": 8
// }
