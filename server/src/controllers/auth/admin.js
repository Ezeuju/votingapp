const authService = require("../../services/auths");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const authController = {
  /**
   * User login endpoint
   * @param {Object} req - Express request object
   * @param {Object} req.body - Contains email and password
   */
  login: asyncControllerWrapper(async (req, res) => {
    req.body.app = "admin";
    const data = await authService.login(req.body);
    sendResponse(200, "Successful.", data)(req, res);
  }),

  verifyOTP: asyncControllerWrapper(async (req, res) => {
    req.body.app = "admin";
    await authService.verifyOTP(req.body);
    sendResponse(200, "Successful.")(req, res);
  }),

  sendOTP: asyncControllerWrapper(async (req, res) => {
    req.body.app = "admin";
    await authService.sendOTP(req.body);
    sendResponse(200, "OTP Successfully Sent.")(req, res);
  }),

  resetPassword: asyncControllerWrapper(async (req, res) => {
    req.body.app = "admin";
    await authService.resetPassword(req.body);
    sendResponse(200, "Password reset successfully")(req, res);
  }),

  /**
   * Change password for authenticated user
   * @param {Object} req - Express request object
   */
  changePassword: asyncControllerWrapper(async (req, res) => {
    req.body.app = "admin";
    await authService.changePassword({
      ...req.body,
      user: req.user.currentUser,
    });
    sendResponse(200, "Password changed successfully")(req, res);
  }),
};

module.exports = authController;
