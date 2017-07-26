const router = require('express-promise-router')();
const OwnerPController = require('../controllers/ownerP');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(OwnerPController.index)
  .post(validateBody(schemas.ownerPSchema), OwnerPController.newOwnerP);

router.route('/:ownerpid') // /ownersP/1
  .get(validateParam(schemas.pIdSchema, 'ownerpid'), OwnerPController.getOwnerP)
  .put([validateParam(schemas.pIdSchema, 'ownerpid'),
    validateBody(schemas.ownerPSchema)],
    OwnerPController.replaceOwnerP)
  .patch([validateParam(schemas.pIdSchema, 'ownerpid'),
    validateBody(schemas.ownerPOptionalSchema)],
    OwnerPController.updateOwnerP)
  .delete(validateParam(schemas.pIdSchema, 'ownerpid'),
    OwnerPController.deleteOwnerP);

module.exports = router;
