const router = require('express-promise-router')();
const FedlandPController = require('../controllers/fedlandP');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(FedlandPController.index);

router.route('/:fedlandpid') // /fedlands/1
  .get(validateParam(schemas.idSchema, 'fedlandpid'), FedlandPController.getFedlandP);

router.route('/forOwnerCode/:ownercode') // /fedlands/forOwnerCode/NPS
  .get(validateParam(schemas.ownerCodeSchema, 'ownercode'), FedlandPController.getFedlandPForOwnerCode);

module.exports = router;
