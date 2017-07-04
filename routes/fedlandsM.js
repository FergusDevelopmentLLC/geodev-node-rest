const router = require('express-promise-router')();
const FedlandMController = require('../controllers/fedlandM');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(FedlandMController.index);

router.route('/:fedlandmId') //fedlandms/xyz
  .get(validateParam(schemas.idSchema, 'fedlandmId'), FedlandMController.getFedlandM);

router.route('/forOwnerCode/:owner_code') //fedlandms/forOwnerCode/xyz
  .get(FedlandMController.getFedlandMForOwnerCode);

module.exports = router;
