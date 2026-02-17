const Joi = require("joi");

exports.validateAddDevice = (model) => {
  const schema = Joi.object({
    device_id: Joi.string().required().messages({
      "any.required": "Title is required.",
      "string.empty": "Title is required.",
    }),
    user_id: Joi.string().required().messages({
      "any.required": "Description is required.",
      "string.empty": "Description is required.",
    }),
  }).unknown(true);
  return schema.validate(model);
};
