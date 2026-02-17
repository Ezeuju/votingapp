const Joi = require("joi");

exports.create = (model) => {
  const schema = Joi.object({
    resource: Joi.string().required().messages({
      "any.required": "Resource is required",
      "string.empty": "Resource cannot be empty",
    }),

    admin_id: Joi.required().messages({
      "string.pattern.base": "admin_id must be a valid ObjectId",
    }),

    action: Joi.string().required().messages({
      "any.required": "Action is required",
      "string.empty": "Action cannot be empty",
    }),

    metadata: Joi.object().optional().default({}),
  }).unknown(false);

  return schema.validate(model);
};
