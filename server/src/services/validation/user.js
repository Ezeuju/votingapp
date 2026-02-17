const Joi = require("joi");

exports.deleteAccount = (model) => {
    const schema = Joi.object({
      deletion_reason: Joi.string()
        .optional()
        .messages({
          "string.base": "deletion_reason must be a string",
          "string.empty": "deletion_reason cannot be empty",
        }),
    }).unknown(true);
  
    return schema.validate(model);
  };