const jwt = require("jsonwebtoken");

const SECRET_KEY = `${process.env.SECRET_KEY}`;
const verifyCAPTCHA = require("../thirdParty/reCAPTCHA");
const environment = process.env.NODE_ENV;
const { AppError } = require("./error");
const { asyncLibWrapper } = require("../utils/wrappers");
const deviceService = require("../services/devices");
const store = require("../models/db/redis");
const appMap = require("./appMap");

const auth = {
  extractJWTToken: asyncLibWrapper(async (req) => {
    let token = req.headers["authorization"] || req.headers["x-access-token"];
    if (token?.startsWith("Bearer")) token = token.slice(7);
    if (!token) throw new AppError(401, "Please login.");

    return token;
  }),

  decodeJWTToken: asyncLibWrapper(async (req, res, next) => {
    const token = await auth.extractJWTToken(req);
    const decoded_token = jwt.decode(token);
    
    if (!decoded_token) {
      throw new AppError(401, "Invalid token format.");
    }
    
    req.user = { currentUser: decoded_token };
    return next();
  }),

  getCurrentUser: asyncLibWrapper(async (req) => {
    const token = await auth.extractJWTToken(req);
    
    let decoded_token;

    try {
      decoded_token = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(440, "Session Expired From JWT.");
      }
    }
    
    let device = null;
    if (decoded_token) {
      const decoded_data = decoded_token.currentUser;
      
      if (decoded_data.type == "User") {
        device = await auth.getCurrentDevice(req, decoded_data._id);
      }
      
      const is_valid_session = await store.verifySession(
        decoded_data,
        token,
        device,
      );
      if (!is_valid_session) throw new AppError(440, "Session Expired From Redis.");
      
      const app_config = appMap[decoded_data.type.toLowerCase()];

      const user = await app_config.Model.findById(decoded_data._id);
      if (!user) throw new AppError(404, "Please create an account.");
      if (!user.status) throw new AppError(403, "Account restricted.");

      return {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        status: user.status,
        type: user.type,
        role: user.role,
        device,
      };
    } else {
      throw new AppError(401, "Please login.");
    }
  }),

  getCurrentDevice: asyncLibWrapper(async (req, user_id = null) => {
    const token = req.headers["device-token"] || req.headers["x-device-token"];
    if (!token) return false;

    // Return decoded device token if valid
    const decoded = jwt.verify(token, SECRET_KEY);

    //get device
    let device = false;
    if (decoded.device_id) {
      device = await deviceService.readByDeviceID(decoded.device_id, user_id);
    }

    if (!device?.is_active) return false;

    return device;
  }),

  deviceTracking: asyncLibWrapper(async (req, res, next) => {
    const token = req.headers["device-token"] || req.headers["x-device-token"];

    if (!token) throw new AppError(403, "Device not recognized.");

    // Return decoded device token if valid
    const device = jwt.verify(token, SECRET_KEY);

    if (device) req.device = device;

    return next();
  }),

  validateRecaptchaToken: asyncLibWrapper(async (req, res, next) => {
    const params = req.body;

    if (environment == "production") {
      if (params.captcha_token) {
        const verify_captcha = await verifyCAPTCHA(params.captcha_token);

        if (!verify_captcha) {
          throw new AppError(
            401,
            "Unable to process information, please try again",
          );
        }
      }
    }

    next();
  }),

  isRateLimited: asyncLibWrapper(async (req, res, next) => {
    const limit = Number(process.env.REDIS_REQUEST_RATE_LIMIT) || 60;
    const user_ip = req.ip;
    const url = req.url;

    const skipped_paths = [
      "/notifications",
      "/devices",
      "/notifications/availability",
      "/banners",
      "/me",
      "/stats",
      "&search",
      "?search",
    ];

    if (skipped_paths.some((path) => url.includes(path))) {
      return next();
    }

    const wait_minutes = 3;
    const request_allowed = await store.rateLimiter(
      user_ip,
      limit,
      wait_minutes,
    );

    if (!request_allowed) {
      throw new AppError(
        429,
        `Too many requests. Please wait ${wait_minutes} minutes before trying again.`,
      );
    }

    next();
  }),

  isLoggedIn: asyncLibWrapper(async (req, res, next) => {
    const user = await auth.getCurrentUser(req);
    req.user = { currentUser: user };
    return next();
  }),

  isLoggedInAdmin: asyncLibWrapper(async (req, res, next) => {
    const user = await auth.getCurrentUser(req);

    if (user.type !== "Admin") {
      throw new AppError(403, "You are not allowed to perform this action.");
    }

    req.user = { currentUser: user };
    return next();
  }),

  isLoggedInSuperAdmin: asyncLibWrapper(async (req, res, next) => {
    const user = await auth.getCurrentUser(req);

    if (user.type !== "Admin" || user.role !== "Super Admin") {
      throw new AppError(403, "You are not allowed to perform this action.");
    }

    req.user = {
      currentUser: user,
    };

    next();
  }),
};

module.exports = auth;
