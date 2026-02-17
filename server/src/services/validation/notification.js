const Joi = require("joi");

exports.validateNotificationId = (model) => {
    const schema = Joi.object({
      notification_id: Joi.alternatives()
        .try(
          Joi.string().required().messages({
            "string.empty": "Notification Id cannot be empty.",
            "any.required": "Notification Id is required.",
          }),
          Joi.array().items(Joi.string().required()).min(1).required().messages({
            "array.base": "Notification Ids must be an array or single ID.",
            "array.min":
              "At least one Notification Id is required when using array.",
            "any.required": "Notification Ids are required.",
            "string.empty": "Notification Ids cannot contain empty values.",
          })
        )
        .required()
        .messages({
          "any.required": "'notification_ids' is required.",
          "alternatives.types":
            "Must provide either a single Id or array of Ids.",
          "alternatives.match": "Invalid Id format provided.",
        }),
    }).unknown(false);
  
    return schema.validate(model, {
      abortEarly: false,
    });
  };
  
  exports.validateSendPush = (model) => {
    const schema = Joi.object({
      title: Joi.string().required().messages({
        "any.required": "Title is required.",
        "string.empty": "Title is required.",
      }),
      description: Joi.string().required().messages({
        "any.required": "Description is required.",
        "string.empty": "Description is required.",
      }),
      device_id: Joi.string().required().messages({
        "any.required": "Device ID is required.",
        "string.empty": "Device ID is required.",
      }),
      metadata: Joi.object({
        type_id: Joi.string().optional(),
        type: Joi.string().optional(),
      })
        .required()
        .messages({
          "any.required": "Metadata is required.",
        }),
    }).unknown(true);
  
    return schema.validate(model);
  };