const Joi = require("joi");

exports.initialize = (model) => {
  const schema = Joi.object({
    first_name: Joi.string().trim().required().messages({
      "any.required": "First name is required.",
      "string.empty": "First name is required.",
    }),
    last_name: Joi.string().trim().required().messages({
      "any.required": "Last name is required.",
      "string.empty": "Last name is required.",
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      "any.required": "Email is required.",
      "string.empty": "Email is required.",
      "string.email": "Email must be valid.",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country is required.",
      "string.empty": "Country is required.",
    }),
    street_address: Joi.string().required().messages({
      "any.required": "Street address is required.",
      "string.empty": "Street address is required.",
    }),
    town: Joi.string().required().messages({
      "any.required": "Town is required.",
      "string.empty": "Town is required.",
    }),
    state: Joi.string().required().messages({
      "any.required": "State is required.",
      "string.empty": "State is required.",
    }),
    audition_plan_id: Joi.string().required().messages({
      "any.required": "Audition plan is required.",
      "string.empty": "Audition plan is required.",
    }),
  }).unknown(true);
  return schema.validate(model);
};

exports.verify = (model) => {
  const schema = Joi.object({
    reference: Joi.string().required().messages({
      "any.required": "Payment reference is required.",
      "string.empty": "Payment reference is required.",
    }),
  }).unknown(true);
  return schema.validate(model);
};
