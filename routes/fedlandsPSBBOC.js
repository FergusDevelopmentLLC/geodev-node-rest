const router = require('express-promise-router')();
const FedlandPSBBOCController = require('../controllers/fedlandPSBBOC');

router.route('/')
  .post(FedlandPSBBOCController.getFedlandPSBBOC);

module.exports = router;
