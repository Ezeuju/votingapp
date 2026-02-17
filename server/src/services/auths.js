const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { AppError } = require("../middleware/error");
const { userModel, deviceModel } = require("../models");
const AUTH = require("../utils/auths");
const helpers = require("../utils/helpers");
const { storeSession } = require("../models/db/redis");
const { asyncLibWrapper } = require("../utils/wrappers");
const { notify } = require("./notifications");
const TOTP = require("../utils/TOTP");
const validation = require("./validation/auth");
const store = require("../models/db/redis");
const deviceService = require("../services/devices");
const logger = require("../logger");
const salt_round = process.env.SALT_ROUND;
const secret_key = process.env.SECRET_KEY;

const appMap = require("../middleware/appMap");

const lib = {
  registerDevice: asyncLibWrapper(async (params) => {
    const { error } = validation.validateDeviceRegistration(params);
    if (error) throw new AppError(400, error.details[0].message);

    const token = AUTH.getJWTNoExpiry(params);

    return {
      device_token: token,
    };
  }),

  register: asyncLibWrapper(async (params, device) => {
    const app_config = appMap[params.app];
    if (!app_config) throw new AppError(400, "Invalid app");

    const { error } = app_config.validation.register(params);
    if (error) throw new AppError(400, error.details[0].message);

    params.email = params.email.trim().toLowerCase();

    const existingUser = await app_config.userExistFn(
      params.email,
      "+password",
    );

    if (existingUser?.status) {
      throw new AppError(400, "Account with this email already exists.");
    }

    if (params.phone) {
      params.phone = helpers.formatPhoneNumber(params.phone.trim());

      const existingUser = await app_config.userExistFn(
        params.phone,
        "+password",
      );

      if (existingUser?.status) {
        throw new AppError(
          400,
          "Account with this phone number already exists.",
        );
      }
    }

    if (params.otp) {
      //verfy OTP
      const isValid = await TOTP.verify(params.otp, existingUser?.totp?.secret);
      if (!isValid) {
        throw new AppError(400, "Invalid or Expired OTP session.");
      }
      params.totp = {
        type: null,
        secret: null,
      };
    }

    if (params.referral_code) {
      //check for refferral code
      const referrer = await lib.findReferral(params.referral_code);

      if (referrer) {
        params.referrer = {
          type: referrer.type,
          id: referrer.id,
        };
      }
    }

    //generate user referral code
    params.my_referral_code = helpers.generateReferralCode(params.email, 10);

    const hash_password = bcrypt.hashSync(params.password, Number(salt_round));

    let register = null;

    if (existingUser) {
      register = await app_config.Model.findByIdAndUpdate(
        existingUser._id,
        {
          ...params,
          password: hash_password,
          status: true,
          account_status: app_config.default_status,
        },
        { new: true },
      );
    } else {
      register = await app_config.Model.create({
        ...params,
        password: hash_password,
        status: true,
        account_status: app_config.default_status,
      });
    }
    if (!register) {
      throw new AppError(500, "Unable to create account.");
    }

    //token
    const token = AUTH.getToken(register);
    await store.storeSession(register, token, device);

    // update device list.
    const create_device = await deviceService.create({
      device_id: device.device_id,
      user_id: register._id.toString(),
      is_active: true,
      device_type: device.device_type,
      device_OS: device.userAgent.os,
      device_platform: device.userAgent.platform,
      device_browser: device.userAgent.browser,
      device_model: device.userAgent.device,
      ip: device.ipAddress,
      country: device.country,
      country_code: device.countryCode,
      region: device.region,
      city: device.city,
      timezone: device.timezone,
      latitude: device.latitude,
      longitude: device.longitude,
      isp: device.isp,
      lastActive: new Date(),
    });

    if (!create_device) {
      logger.error(
        `[Auths] Unable to create/update device for user: ${register._id}`,
      );
    }

    // notify
    notify(
      "registration_completed",
      { email: register.email },
      { email: true },
      { first_name: params.first_name },
    );

    return { token: token };
  }),

  sendOTP: asyncLibWrapper(async (params, user = null) => {
    const app_config = appMap[params.app];
    if (!app_config) throw new AppError(400, "Invalid app");

    const { error } = validation.sendOTP(params);
    if (error) throw new AppError(400, error.details[0].message);

    params.identifier = params.identifier.trim().toLowerCase();

    //check existing user
    const existingUser = await app_config.userExistFn(
      params.identifier,
      "-password",
    );

    if (!existingUser && user !== null) {
      throw new AppError(400, "Account does not exist");
    }

    const generated_token = await TOTP.generate(6);

    params.totp = {
      type: params.otp_type,
      secret: generated_token.secret,
    };

    let account = null;

    if (params.otp_type == "CREATE_ACCOUNT") {
      if (existingUser?.status) throw new AppError(400, "User already exists.");

      if (!existingUser) {
        //no record found
        account = new app_config.Model({
          email: params.identifier,
          totp: params.totp,
          status: false,
        });

        account = await account.save({ validateBeforeSave: false });
      } else {
        //existing user with status false - update totp
        account = await app_config.Model.findByIdAndUpdate(
          existingUser._id,
          {
            totp: params.totp,
          },
          { new: true },
        );
      }

      if (!account) {
        throw new AppError(400, "Unable to send new OTP, please try again");
      }

      notify(
        "verify_email",
        account,
        {
          email: true,
        },
        {
          verification_code: generated_token.token,
        },
      );

      return true;
    }

    account = await app_config.Model.findByIdAndUpdate(existingUser._id, {
      totp: params.totp,
    });

    if (!account) {
      throw new AppError(400, "Unable to send new OTP, please try again");
    }

    notify(
      "forgot_password",
      account,
      {
        email: true,
      },
      {
        verification_code: generated_token.token,
        first_name: account.first_name,
        last_name: account.last_name,
      },
    );

    return true;
  }),

  verifyOTP: asyncLibWrapper(async (params, user = null) => {
    const app_config = appMap[params.app];
    if (!app_config) throw new AppError(400, "Invalid app");

    const { error } = validation.verifyOTP(params);
    if (error) throw new AppError(400, error.details[0].message);

    let existingUser = null;
    if (user) {
      existingUser = await lib.userExist(user._id, "totp _id email temp");
    } else {
      params.identity = helpers.formatPhoneNumber(params.identity);
      existingUser = await app_config.userExistFn(
        params.identifier,
        "totp _id email temp",
      );
    }

    if (!existingUser) {
      throw new AppError(404, "User not found.");
    }

    // Check if the user has a verification code
    if (params.otp_type != existingUser.totp.type) {
      throw new AppError(400, "Invalid verification type.");
    }

    if (!existingUser.totp.secret) {
      throw new AppError(400, "User does not have a verification code.");
    }

    // Verify the OTP
    const isValid = await TOTP.verify(params.otp, existingUser.totp.secret);
    if (!isValid) {
      throw new AppError(400, "Invalid OTP.");
    }

    return true;
  }),

  refreshToken: asyncLibWrapper(async (params) => {
    const { error } = validation.refreshToken(params);
    if (error) throw new AppError(400, error.details[0].message);

    try {
      const decoded_token = jwt.verify(params.refresh_token, secret_key);
      const user_id = decoded_token.currentUser._id;

      // Verify refresh token exists in Redis
      const is_valid_refresh_token = await store.verifyRefreshToken(
        user_id,
        params.refresh_token,
        decoded_token.currentUser.device,
      );

      if (!is_valid_refresh_token) {
        throw new AppError(401, "Invalid refresh token.");
      }

      // Get user type to fetch from correct model
      const user_type = decoded_token.currentUser.type || "User";
      const app_config = appMap[user_type.toLowerCase()];

      if (!app_config) {
        throw new AppError(400, "Invalid user type.");
      }

      // Fetch fresh user data
      const user = await app_config.Model.findById(user_id);

      if (!user || !user.status) {
        throw new AppError(401, "User not found or inactive.");
      }

      // Generate new access token
      const token = AUTH.getToken(user);

      // Update session with new access token
      await storeSession(user._id, token.access_token);

      return {
        access_token: token.access_token,
        refresh_token: params.refresh_token,
      };
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        throw new AppError(401, "Invalid or expired refresh token.");
      }
      throw err;
    }
  }),

  login: asyncLibWrapper(async (params, device) => {
    const { error } = validation.login(params);
    if (error) throw new AppError(400, error.details[0].message);

    const checkLock = await store.lock("login", device.device_id, 3);
    if (!checkLock)
      throw new AppError(
        500,
        "Too many request, Please try again after few minutes.",
      );

    params.id = params.email.trim().toLowerCase();

    const app_config = appMap[params.app];

    const user = await app_config.userExistFn(
      params.id,
      "+password email type status",
    );

    if (!user) {
      throw new AppError(
        400,
        "Incorrect login credentials. Please check and try again.",
      );
    }

    if (!user.status) throw new AppError(403, "Account restricted.");

    const valid_password = bcrypt.compareSync(params.password, user.password);

    if (!valid_password) {
      throw new AppError(
        400,
        "Incorrect login credentials. Please check and try again.",
      );
    }

    user.password = null;

    const token = AUTH.getToken(user);
    await storeSession(user, token, device);

    // update device list.
    const create_device = await deviceService.create({
      device_id: device.device_id,
      user_id: user._id.toString(),
      is_active: true,
      device_type: device.device_type,
      device_OS: device.userAgent.os,
      device_platform: device.userAgent.platform,
      device_browser: device.userAgent.browser,
      device_model: device.userAgent.device,
      ip: device.ipAddress,
      country: device.country,
      country_code: device.countryCode,
      region: device.region,
      city: device.city,
      timezone: device.timezone,
      latitude: device.latitude,
      longitude: device.longitude,
      isp: device.isp,
      lastActive: new Date(),
    });

    if (!create_device) {
      logger.error(
        `[Auths] Unable to create/update device for user: ${user._id}`,
      );
    }

    return { access_token: token.access_token, refresh_token: token.refresh_token };
  }),

  forgotPassword: asyncLibWrapper(async (params) => {
    const app_config = appMap[params.app];
    if (!app_config) throw new AppError(400, "Invalid app");

    const { error } = validation.resendOTP(params);
    if (error) throw new AppError(400, error.details[0].message);

    //get user
    params.identifier = params.identifier.trim().toLowerCase();

    //check existing user
    const existingUser = await app_config.userExistFn(
      params.identifier,
      "+_id email firstname lastname account_status",
    );
    if (!existingUser) {
      throw new AppError(400, "Account does not exist");
    }

    const generated_token = await TOTP.generate(6);

    params.totp = {
      type: "RESET_PASSWORD",
      secret: generated_token.secret,
    };

    const user = await app_config.Model.findByIdAndUpdate(
      existingUser._id,
      {
        totp: params.totp,
      },
      {
        new: true,
      },
    );

    if (!user) {
      throw new AppError(400, "Unable to reset password.");
    }
    return true;
  }),

  resetPassword: asyncLibWrapper(async (params) => {
    const app_config = appMap[params.app];
    if (!app_config) throw new AppError(400, "Invalid app");

    const { error } = validation.resetPassword(params);
    if (error) throw new AppError(400, error.details[0].message);

    //get user
    params.identifier = params.email.trim().toLowerCase();

    //check existing user
    const existingUser = await app_config.userExistFn(
      params.identifier,
      "+_id email firstname lastname account_status totp",
    );
    if (!existingUser) {
      throw new AppError(400, "Account does not exist");
    }

    //verify OTP
    // Check if the user has a verification code
    if (existingUser.totp.type != "RESET_PASSWORD") {
      throw new AppError(400, "Unable to reset password.");
    }

    if (!existingUser.totp.secret) {
      throw new AppError(400, "User does not have a verification code.");
    }

    // Verify the OTP
    const isValid = await TOTP.verify(params.otp, existingUser.totp.secret);
    if (!isValid) {
      throw new AppError(400, "Invalid OTP.");
    }

    //success
    const hashed_password = bcrypt.hashSync(
      params.new_password,
      Number(salt_round),
    );

    const update_user = await app_config.Model.findByIdAndUpdate(
      existingUser._id,
      {
        $set: {
          password: hashed_password,
          totp: { secret: null, type: null },
        },
      },
    );

    if (!update_user) {
      throw new AppError(400, "Unable to reset password.");
    }

    return true;
  }),

  changePassword: asyncLibWrapper(async (params) => {
    const { error } = validation.changePassword(params);
    if (error) throw new AppError(400, error.details[0].message);

    const app_config = appMap[params.app];

    params.identifier = params.user.email;

    const user = await app_config.userExistFn(
      params.identifier,
      "+_id email firstname lastname account_status password",
    );

    if (!user) throw new AppError(404, "Resource not found.");

    // check if current password matches
    const is_current_password_match = bcrypt.compareSync(
      params.current_password,
      user.password,
    );

    if (!is_current_password_match) {
      throw new AppError(400, "Current password is incorrect.");
    }

    // hash the new password
    const hash_password = bcrypt.hashSync(
      params.new_password,
      Number(salt_round),
    );

    const update_password = await user.updateOne({
      password: hash_password,
    });

    if (!update_password) throw new AppError(500, "Internal server error.");

    return true;
  }),

  passcode: asyncLibWrapper(async (params, currentUser) => {
    const { error } = validation.setPasscode(params);
    if (error) throw new AppError(400, error.details[0].message);

    const app_config = appMap[currentUser.type];

    const user = await app_config.userExistFn(
      currentUser._id,
      "+_id email status account_status passcode",
    );

    if (!user) throw new AppError(404, "Account not found.");

    if (!user.status) throw new AppError(403, "Invalid account.");

    if (user.account_status != "active" && user.account_status != "pending")
      throw new AppError(403, "Account restricted.");

    if (user.passcode) {
      //change Passcode Process
      throw new AppError(404, "Passcode already set");
    }

    // hash the new password
    const hash_password = bcrypt.hashSync(params.passcode, Number(salt_round));

    const update_password = await app_config.Model.findByIdAndUpdate(user._id, {
      passcode: hash_password,
      has_passcode: true,
    });

    if (!update_password) throw new AppError(500, "Unable to update");

    return true;
  }),

  biometric: asyncLibWrapper(async (params, currentUser) => {
    const { error } = validation.setBiometric(params);
    if (error) throw new AppError(400, error.details[0].message);

    const app_config = appMap[currentUser.type];

    const user = await app_config.userExistFn(
      currentUser._id,
      "+_id email status account_status passcode biometric",
    );

    if (!user) throw new AppError(404, "Account not found.");

    if (!user.status) throw new AppError(403, "Invalid account.");

    if (user.account_status != "active" && user.account_status != "pending")
      throw new AppError(403, "Account restricted.");

    const update = await app_config.Model.findByIdAndUpdate(user._id, {
      biometric: params.biometric,
    });

    if (!update) throw new AppError(500, "Unable to update");

    return true;
  }),

  //biometric and Passcode
  authenticate: asyncLibWrapper(async (params, currentUser) => {
    const { error } = validation.authenticate(params);
    if (error) throw new AppError(400, error.details[0].message);

    const app_config = appMap[currentUser.type];

    const user = await app_config.userExistFn(currentUser._id, "+passcode");

    if (!user) {
      throw new AppError(400, "Unable to identify user");
    }

    if (!user.status) throw new AppError(403, "Invalid account.");

    if (user.account_status != "active" && user.account_status != "pending")
      throw new AppError(403, "Account restricted.");

    if (params.passcode) {
      const valid_passcode = bcrypt.compareSync(params.passcode, user.passcode);
      if (!valid_passcode) {
        throw new AppError(
          400,
          "Incorrect passcode. Please check and try again.",
        );
      }
    }
    if (params.biometric) {
      if (!user.biometric) {
        throw new AppError(400, "User does not have biometric enabled");
      }
    }

    const token = AUTH.getToken(user);
    await storeSession(user, token);

    return { token: token };
  }),

  findReferral: asyncLibWrapper(async (referral_code) => {
    referral_code.trim();
    if (!referral_code) return false;

    const user = await userModel.findOne({
      my_referral_code: referral_code,
    });

    if (user) {
      return {
        type: "user",
        id: user._id,
      };
    }

    return false;
  }),

  logout: asyncLibWrapper(async (currentUser, all_session = false) => {
    const user_id = currentUser._id;
    const device_id = currentUser?.device?.device_id;

    // If device_id is provided and user type is "User", verify device ownership
    if (currentUser.type === "User") {
      const foundDevice = await deviceModel.findOne({
        device_id,
        user_id,
      });

      if (!foundDevice) {
        throw new AppError(404, "Device belongs to another account.");
      }
    }

    // Attempt logout via store
    const logout_success = await store.logout(
      { _id: user_id },
      all_session,
      device_id,
    );

    if (!logout_success) return false;

    // Update device(s) accordingly
    const updateFields = { is_active: false, lastActive: new Date() };

    if (device_id) {
      await deviceModel.findOneAndUpdate(
        { device_id, user_id },
        { $set: updateFields },
      );
    } else {
      await deviceModel.updateMany({ user_id }, { $set: updateFields });
    }

    return true;
  }),
};

module.exports = lib;
