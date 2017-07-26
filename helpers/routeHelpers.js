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
    ownerCodeSchema: Joi.object().keys ({
      param: Joi.string().regex(/^[A-Z]{3,3}$/).required(),
    }),

    pIdSchema: Joi.object().keys ({
      param: Joi.number().integer().min(1)
    }),

    ownerPSchema: Joi.object().keys ({
      owner_code: Joi.string().regex(/^[A-Z]{3,3}$/).required(),
      owner: Joi.string().required(),
      color: Joi.string().required(),
      orderby: Joi.number().integer().min(1).max(100).required()
    }),

    ownerPOptionalSchema: Joi.object().keys ({
      owner_code: Joi.string().regex(/^[A-Z]{3,3}$/),
      owner: Joi.string(),
      color: Joi.string(),
      orderby: Joi.number().integer().min(1).max(100)
    }),

    mIdSchema: Joi.object().keys ({
      param: Joi.string()
    }),

    ownerMSchema: Joi.object().keys ({
      owner_code: Joi.string().regex(/^[A-Z]{3,3}$/).required(),
      owner: Joi.string().required(),
      color: Joi.string().required(),
      orderby: Joi.number().integer().min(1).max(100).required()
    }),

    ownerMOptionalSchema: Joi.object().keys ({
      owner_code: Joi.string().regex(/^[A-Z]{3,3}$/),
      owner: Joi.string(),
      color: Joi.string(),
      orderby: Joi.number().integer().min(1).max(100)
    }),

    fedlandPSBBOCSchema: Joi.object().keys ({
    	owner_code : Joi.string().regex(/^[A-Z]{3,3}$/).required(),
    	left_lng : Joi.number().required(),
    	bottom_lat : Joi.number().required(),
    	right_lng : Joi.number().required(),
    	top_lat : Joi.number().required(),
    	simplification : Joi.number().min(0.001).max(1).required(),
    	geojson_digits : Joi.number().integer().min(1).max(15).required(),
    	srid : Joi.number().integer().min(1).required()
    })

  }
}
