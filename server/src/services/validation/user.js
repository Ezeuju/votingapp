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

exports.addAudition = (model) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    // audition_date: Joi.date().required(),
    // audition_time: Joi.string().required(),
    audition_plan_id: Joi.string().required(),
  });

  return schema.validate(model);
};