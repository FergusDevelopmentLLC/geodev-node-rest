const router = require('express-promise-router')();
const FedlandPController = require('../controllers/fedlandP');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(FedlandPController.index);

router.route('/:fedlandpid') //fedlands/xyz
  .get(validateParam(schemas.idSchema, 'fedlandpid'), FedlandPController.getFedlandP);

router.route('/forOwnerCode/:ownercode') //fedlands/forOwnerCode/xyz
  .get(validateParam(schemas.ownerCodeSchema, 'ownercode'), FedlandPController.getFedlandPForOwnerCode);

module.exports = router;
