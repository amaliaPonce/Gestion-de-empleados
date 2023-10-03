const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  id: Joi.number().integer().required(),
  password: Joi.string().required(),
});


module.exports = {
  registerSchema,
  loginSchema,
};
