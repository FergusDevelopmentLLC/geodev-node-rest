const router = require('express-promise-router')();
const OwnerPController = require('../controllers/ownerP');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(OwnerPController.index)
  .post(validateBody(schemas.ownerPSchema), OwnerPController.newOwnerP);

router.route('/:ownerpid') // /ownersP/1
  .get(validateParam(schemas.idSchema, 'ownerpid'), OwnerPController.getOwnerP)
  .put([validateParam(schemas.idSchema, 'ownerpid'),
    validateBody(schemas.ownerPSchema)],
    OwnerPController.replaceOwnerP)
  .patch([validateParam(schemas.idSchema, 'ownerpid'),
    validateBody(schemas.ownerPOptionalSchema)],
    OwnerPController.updateOwnerP)
  .delete(validateParam(schemas.idSchema, 'ownerpid'),
    OwnerPController.deleteOwnerP);

module.exports = router;
