const router = require('express-promise-router')();
const FedlandMController = require('../controllers/fedlandM');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(FedlandMController.index);

router.route('/forOwnerCode/:owner_code') //fedlandsM/forOwnerCode/NPS
  .get(FedlandMController.getFedlandMForOwnerCode);

module.exports = router;
