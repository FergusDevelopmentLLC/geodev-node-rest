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
      param: Joi.number().integer().min(1).max(100)
    }),

    ownerCodeSchema: Joi.object().keys ({
      param: Joi.string().alphanum().min(3).max(3).required()
    }),

    ownerSchema: Joi.object().keys ({
      owner_code: Joi.string().alphanum().min(3).max(3).required(),
      owner: Joi.string().required(),
      color: Joi.string().required(),
      orderby: Joi.number().integer().min(1).max(100)
    }),

    ownerOptionalSchema: Joi.object().keys ({
      owner_code: Joi.string().alphanum().min(3).max(3).required(),
      owner: Joi.string(),
      color: Joi.string(),
      orderby: Joi.number().integer().min(1).max(100)
    }),

    fedlandPSBBOCSchema: Joi.object().keys ({
    	owner_code : Joi.string().alphanum().min(3).max(3).required(),
    	left_lng : Joi.number().min(-180).max(180).required(),
    	bottom_lat : Joi.number().min(-90).max(90).required(),
    	right_lng : Joi.number().min(-180).max(180).required(),
    	top_lat : Joi.number().min(-90).max(90).required(),
    	simplification : Joi.number().min(0.001).max(1).required(),
    	geojson_digits : Joi.number().integer().min(1).max(15).required(),
    	srid : Joi.number().integer().required()
    })

  }
}
