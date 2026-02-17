const authService = require("../../services/auths");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

/**
 * Authentication Controller
 *
 * Handles user authentication processes including:
 * - Registration and verification
 * - Login
 * - Password reset and change operations
 */
const authController = {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} req.body - User registration data
   */
  register: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    const data = await authService.register(req.body, {
      ...req.device,
      ...req.clientInfo,
    });
    sendResponse(201, "Successful.", data)(req, res);
  }),

  sendOTP: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    await authService.sendOTP(req.body);
    sendResponse(200, "OTP Successfully Sent.")(req, res);
  }),

  verifyOTP: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    await authService.verifyOTP(req.body);
    sendResponse(200, "Successful.")(req, res);
  }),

  /**
   * Authenticate user and return auth tokens
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain email and password
   */
  login: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    const data = await authService.login(req.body, {
      ...req.device,
      ...req.clientInfo,
    });
    sendResponse(200, "Login Successful", data)(req, res);
  }),

  /**
   * Reset user password
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain new password and token
   */
  resetPassword: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    await authService.resetPassword(req.body);
    sendResponse(200, "Password reset successfully")(req, res);
  }),

  /**
   * Change password for authenticated user
   * @param {Object} req - Express request object
   */
  changePassword: asyncControllerWrapper(async (req, res) => {
    req.body.app = "user";
    await authService.changePassword({
      ...req.body,
      user: req.user.currentUser,
    });
    sendResponse(200, "Password changed successfully")(req, res);
  }),

  logout: asyncControllerWrapper(async (req, res) => {
    await authService.logout(
      req.user?.currentUser,
      req.query.all_session || false,
    );

    sendResponse(200, `Successful.`)(req, res);
  }),
};

module.exports = authController;
