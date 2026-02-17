const Joi = require("joi");

exports.create = (model) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required.",
      "string.empty": "Title is required.",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description is required.",
      "string.empty": "Description is required.",
    }),
    type: Joi.string().valid("ticket", "audition").required().messages({
      "any.required": "Type is required.",
      "string.empty": "Type is required.",
      "any.only": "Type must be either 'ticket' or 'audition'.",
    }),
    amount: Joi.number().positive().required().messages({
      "any.required": "Amount is required.",
      "number.base": "Amount must be a number.",
      "number.positive": "Amount must be a positive number.",
    }),
    features: Joi.array().items(Joi.string()).messages({
      "array.base": "Features must be an array of strings.",
    }),
  }).unknown(true);
  return schema.validate(model);
};
