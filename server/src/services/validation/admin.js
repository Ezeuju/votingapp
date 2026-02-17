const Joi = require("joi");

exports.create = (model) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters.",
      "string.max": "First name cannot exceed 50 characters.",
      "any.required": "First name is required.",
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 2 characters.",
      "string.max": "Last name cannot exceed 50 characters.",
      "any.required": "Last name is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),
    role: Joi.string()
      .valid("Super Admin", "Admin", "Support")
      .default("user")
      .messages({
        "any.only": "Role must be either Super Admin, Admin, or Support.",
      }),
  }).unknown(false);

  return schema.validate(model);
};

exports.update = (model) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(50).messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
    }),
    last_name: Joi.string().min(2).max(50).messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address",
    }),
    role: Joi.string().valid("Super Admin", "Admin", "Support").messages({
      "any.only": "Role must be one of Super Admin, Admin, or Support.",
    }),
    account_status: Joi.string()
      .valid("active", "inactive")
      .messages({
        "any.only": "Account status must be either 'active' or 'inactive'.",
        "any.required": "Account status is required.",
      }),
  }).unknown(true);

  return schema.validate(model);
};
