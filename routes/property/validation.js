const Joi = require("joi");

// signup validation
const propertyValidation = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.array().required(),
  address: Joi.string().required(),
  type: Joi.array().required(),
  gallery: Joi.array().required(),
  tags: Joi.array().required(),
  description: Joi.string().required(),
  condition: Joi.array().required(),
  amenities: Joi.array().required(),
  video: Joi.string().required(),
  location: Joi.string().required(),
  agreeToTerms: Joi.boolean().required(),
});

module.exports.propertyValidation = propertyValidation;
