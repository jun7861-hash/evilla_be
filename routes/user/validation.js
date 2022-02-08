const Joi = require("joi");

// signup validation
const signupValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.number(),
  agreeToTerms: Joi.boolean().required(),
});

// signin validation
const signinValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;
