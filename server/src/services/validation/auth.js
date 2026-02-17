const Joi = require("joi");

exports.validateDeviceRegistration = (model) => {
  // Validation schema for device info where only device_id and device_type are required.
  const schema = Joi.object({
    device_id: Joi.string().required().messages({
      "any.required": "Device ID is required",
      "string.empty": "Device ID cannot be empty",
    }),
    device_type: Joi.string().required().messages({
      "any.required": "Device type is required",
      "string.empty": "Device type cannot be empty",
    }),
    device_platform: Joi.string().optional(),
    device_OS: Joi.string().optional(),
  }).unknown(); // Allow unknown additional properties

  return schema.validate(model);
};

exports.userRegister = (model) => {
  const schema = Joi.object({
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
    first_name: Joi.string().required().max(50).messages({
      "any.required": "First name is required",
      "string.empty": "First name cannot be empty",
      "string.max": "First name cannot exceed 50 characters",
    }),
    last_name: Joi.string().required().max(50).messages({
      "any.required": "Last name is required",
      "string.empty": "Last name cannot be empty",
      "string.max": "Last name cannot exceed 50 characters",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "any.required": "Phone number is required",
        "string.pattern.base": "Please enter a valid phone number",
        "string.empty": "Phone number cannot be empty",
      }),
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Please enter a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    otp: Joi.string().required().messages({
      "any.required": "OTP is required",
      "string.empty": "OTP cannot be empty",
    }),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.base": "Password should be a text string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    referral_code: Joi.string().optional().allow("").max(20).messages({
      "string.max": "Referral code cannot exceed 20 characters",
    }),
  }).unknown(false);

  return schema.validate(model);
};

exports.sendOTP = (model) => {
  const schema = Joi.object({
    identifier: Joi.string().required().messages({
      "any.required": "Identifier is required",
      "string.empty": "Identifier cannot be empty",
    }),
    app: Joi.string().required().messages({
      "any.required": "App name is required",
      "string.empty": "App name cannot be empty",
    }),
    otp_type: Joi.string()
      .valid(
        "CREATE_ACCOUNT",
        "LOGIN",
        "RESET_PASSWORD",
        "CHANGE_EMAIL",
        "CHANGE_PHONE",
      )
      .required()
      .messages({
        "any.required": "OTP type is required",
        "any.only": "Invalid OTP type provided",
        "string.empty": "OTP type cannot be empty",
      }),
  }).unknown(false);

  return schema.validate(model);
};

exports.verifyOTP = (model) => {
  const schema = Joi.object({
    identifier: Joi.string().required().messages({
      "any.required": "Identifier is required",
      "string.empty": "Identifier cannot be empty",
    }),
    app: Joi.string().required().messages({
      "any.required": "App name is required",
      "string.empty": "App name cannot be empty",
    }),
    otp_type: Joi.string()
      .valid(
        "CREATE_ACCOUNT",
        "LOGIN",
        "RESET_PASSWORD",
        "CHANGE_EMAIL",
        "CHANGE_PHONE",
      )
      .required()
      .messages({
        "any.required": "OTP type is required",
        "any.only": "Invalid OTP type provided",
        "string.empty": "OTP type cannot be empty",
      }),
    otp: Joi.string().required().messages({
      "any.required": "OTP is required",
      "string.empty": "OTP cannot be empty",
    }),
  }).unknown(false);

  return schema.validate(model);
};

exports.login = (model) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Please enter a valid email address",
    }),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.base": "Password should be a text string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
  }).unknown(false); // Strict mode - no additional properties allowed

  return schema.validate(model);
};

exports.changePassword = (model) => {
  const schema = Joi.object({
    user: Joi.object().optional(),
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
    current_password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.base": "Password should be a text string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    new_password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.base": "Password should be a text string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
  }).unknown(false); // Strict mode - no additional properties allowed

  return schema.validate(model);
};

exports.resetPassword = (model) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Please enter a valid email address",
    }),
    otp: Joi.string().required().messages({
      "any.required": "OTP is required",
      "string.empty": "OTP cannot be empty",
    }),
    new_password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.base": "Password should be a text string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
  }).unknown(false); // Strict mode - no additional properties allowed

  return schema.validate(model);
};

exports.setPasscode = (model) => {
  const schema = Joi.object({
    passcode: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "Passcode must be a string",
        "string.empty": "Passcode cannot be empty",
        "string.length": "Passcode must be exactly 6 digits",
        "string.pattern.base": "Passcode must contain only numbers",
        "any.required": "Passcode is required",
      }),
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
  }).unknown(false); // Strict mode - no additional properties allowed

  return schema.validate(model);
};

exports.setBiometric = (model) => {
  const schema = Joi.object({
    biometric: Joi.boolean()
      .required()
      .strict() // Prevents type coercion
      .messages({
        "boolean.base": "Biometric field must be a boolean",
        "any.required": "Biometric consent is required",
      }),
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),
  }).unknown(false); // Strict mode - no additional properties allowed

  return schema.validate(model);
};

exports.refreshToken = (model) => {
  const schema = Joi.object({
    refresh_token: Joi.string().required().messages({
      "any.required": "Refresh token is required",
      "string.empty": "Refresh token cannot be empty",
    }),
  }).unknown(false);

  return schema.validate(model);
};

exports.authenticate = (data) => {
  const schema = Joi.object({
    app: Joi.string().required().messages({
      "any.required": "App identifier is required",
      "string.empty": "App identifier cannot be empty",
    }),

    passcode: Joi.string().length(6).pattern(/^\d+$/).messages({
      "string.length": "Passcode must be exactly 6 digits",
      "string.pattern.base": "Passcode must contain only numbers",
    }),

    biometric: Joi.boolean().valid(true).messages({
      "boolean.base": "Biometric must be a boolean",
      "any.only": "Biometric must be set to true",
    }),
  })
    .xor("passcode", "biometric")
    .messages({
      "object.missing": "You must provide either a passcode or biometric",
      "object.xor": "Only one of passcode or biometric must be provided",
    });

  return schema.validate(data, { abortEarly: false });
};
