
exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('owner', function (table) {
      table.integer('orderby');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('owner', function (table) {
      table.dropColumn('orderby');
    })
};


// {
//     "id": 1,
//     "owner_code": "BOR",
//     "owner": "Bureau of Reclamation",
//     "color": "#1f78b4",
//     "orderby": 1
// },
// {
//     "id": 2,
//     "owner_code": "BLM",
//     "owner": "Bureau of Land Management",
//     "color": "#b2df8a",
//     "orderby": 2
// },
// {
//     "id": 3,
//     "owner_code": "DOD",
//     "owner": "Department of Defense",
//     "color": "#33a02c",
//     "orderby": 3
// },
// {
//     "id": 4,
//     "owner_code": "FWS",
//     "owner": "Fish and Wildlife Service",
//     "color": "#fb9a99",
//     "orderby": 4
// },
// {
//     "id": 5,
//     "owner_code": "FS",
//     "owner": "Forest Service",
//     "color": "#e31a1c",
//     "orderby": 5
// },
// {
//     "id": 6,
//     "owner_code": "NPS",
//     "owner": "National Park Service",
//     "color": "#fdbf6f",
//     "orderby": 6
// },
// {
//     "id": 7,
//     "owner_code": "PRI",
//     "owner": "State or Privately owned",
//     "color": "#ff7f00",
//     "orderby": 8
// },
// {
//     "id": 8,
//     "owner_code": "TVA",
//     "owner": "Tennessee Valley Authority",
//     "color": "#6a3d9a",
//     "orderby": 7
// }
