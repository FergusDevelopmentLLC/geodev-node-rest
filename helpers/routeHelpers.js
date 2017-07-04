const Joi = require('joi');

module.exports = {
  validateParam: (schema, name) => {
    return (req, res, next) => {
      const result = Joi.validate({ param: req['params'][name] }, schema);
      if(result.error){
        return res.status(400).json(result.error);
      } else {
        if(!req.value) {
          req.value = {};
        }
        if(!req.value['params']) {
          req.value['params'] = {};
        }
        req.value['params'][name] = result.value.param;
        next();
      }
    }
  },

  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if(result.error){
        return res.status(400).json(result.error);
      } else {
        if(!req.value) {
          req.value = {};
        }
        if(!req.value['body']) {
          req.value['body'] = {};
        }
        req.value['body'] = result.value;
        next();
      }
    }
  },

  schemas: {
    idSchema: Joi.object().keys ({
      param: Joi.number().required() //TODO: make better
    }),

    ownerCodeSchema: Joi.object().keys ({
      param: Joi.string().required() //TODO: make better
    }),

    ownerSchema: Joi.object().keys ({
      owner_code: Joi.string().required(),
      owner: Joi.string().required(),
      color: Joi.string().required(),
      orderby: Joi.number().required()
    }),

    ownerOptionalSchema: Joi.object().keys ({
      owner_code: Joi.string(),
      owner: Joi.string(),
      color: Joi.string(),
      orderby: Joi.number()
    })
  }
}
