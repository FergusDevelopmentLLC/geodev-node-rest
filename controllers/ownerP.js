const OwnerP = require('../models/ownerP');
const Knex = require('knex');
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig.development);// Initialize knex

module.exports = {

  index: async (req, res, next) => {
    const owners = await OwnerP
      .query()
      .eager(req.query.eager)
      .skipUndefined()
      .orderBy('orderby');

    res.status(200).json(owners);
  },

  newOwnerP: async (req, res, next) => {

    const newOwnerP = new OwnerP(req.value.body);
    newOwnerP.owner_code = req.value.body.owner_code;
    newOwnerP.owner = req.value.body.owner;
    newOwnerP.color = req.value.body.color;
    newOwnerP.orderby = req.value.body.orderby;

    const [ owner_id ] = await knex
    .insert(newOwnerP)
    .into('owner')
    .returning('id');

    newOwnerP.id = owner_id;
    res.status(201).json(newOwnerP);
  },

  getOwnerP: async (req, res, next) => {
    var ownerpid = req.value.params.ownerpid;
    const owner = await OwnerP
      .query()
      .where('id', ownerpid)
      .limit(1);
    res.status(200).json(owner[0]);
  },

  deleteOwnerP: async (req, res, next) => {
    var ownerpid = req.value.params.ownerpid;
    const owner = await OwnerP
      .query()
      .where('id', ownerpid)
      .limit(1)
      .del();
    res.status(200).json('success');
  },

  replaceOwnerP: async (req, res, next) => {
    const ownerpid = req.value.params.ownerpid;

    var owner = await OwnerP
      .query()
      .where('id', ownerpid)
      .limit(1);

    owner = owner[0];

    owner.owner_code = req.value.body.owner_code;
    owner.owner = req.value.body.owner;
    owner.color = req.value.body.color;
    owner.orderby = req.value.body.orderby;

    const update = await knex('owner')
      .where('id', ownerId)
      .update(owner)
      .limit(1);

    res.status(201).json(owner);
  },

  updateOwnerP: async (req, res, next) => {
    const ownerpid = req.value.params.ownerpid;

    var owner = await OwnerP
      .query()
      .where('id', ownerpid)
      .limit(1);

    owner = owner[0];

    if(req.value.body.owner_code)
      owner.owner_code = req.value.body.owner_code;
    if(req.value.body.owner)
      owner.owner = req.value.body.owner;
    if(req.value.body.color)
      owner.color = req.value.body.color;
    if(req.value.body.orderby)
      owner.orderby = req.value.body.orderby;

    const update = await knex('owner')
      .where('id', ownerId)
      .update(owner)
      .limit(1);

    res.status(201).json(owner);
  }

};
