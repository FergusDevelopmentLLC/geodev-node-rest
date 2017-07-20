const router = require('express-promise-router')();
const FedlandPSBBOCController = require('../controllers/fedlandPSBBOC');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .post(validateBody(schemas.fedlandPSBBOCSchema), FedlandPSBBOCController.getFedlandPSBBOC);

module.exports = router;
