const router = require('express-promise-router')();
const FedlandPController = require('../controllers/fedlandP');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/') // http://104.236.16.91:8641/fedlandsP/
  .get(FedlandPController.index);

router.route('/forOwnerCode/:ownercode') // http://104.236.16.91:8641/fedlandsP/forOwnerCode/TVA
  .get(validateParam(schemas.ownerCodeSchema, 'ownercode'), FedlandPController.getFedlandPForOwnerCode);

module.exports = router;
