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
   * Register a new device
   * @param {Object} req - Express request object
   * @param {Object} req.body - Device registration data
   */
  registerDevice: asyncControllerWrapper(async (req, res) => {
    const data = await authService.registerDevice(req.body);
    sendResponse(200, "Successful.", data)(req, res);
  }),

  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} req.body - User registration data
   */
  registerUser: asyncControllerWrapper(async (req, res) => {
    await authService.register(req.body, {
      ...req.device,
      ...req.clientInfo,
    });
    sendResponse(
      201,
      "Registration successful. Please check your email for verification.",
    )(req, res);
  }),

  /**
   * Resend registration verification code
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain user email
   */
  resendVerificationCode: asyncControllerWrapper(async (req, res) => {
    await authService.resendRegistrationVerificationCode(req.body);
    sendResponse(200, "Verification code resent successfully")(req, res);
  }),

  /**
   * Validate registration token and complete registration
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain verification token
   */
  completeRegistration: asyncControllerWrapper(async (req, res) => {
    await authService.validateRegistrationToken(req.body);
    sendResponse(200, "Registration completed successfully")(req, res);
  }),

  /**
   * Authenticate user and return auth tokens
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain email and password
   */
  login: asyncControllerWrapper(async (req, res) => {
    const authData = await authService.login(req.body);
    sendResponse(200, "Login successful", authData)(req, res);
  }),

  /**
   * Initiate password reset process
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain user email
   */
  requestPasswordReset: asyncControllerWrapper(async (req, res) => {
    await authService.generateResetPasswordToken(req.body);
    sendResponse(200, "Password reset instructions sent to your email")(
      req,
      res,
    );
  }),

  /**
   * Validate password reset token
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain reset token
   */
  validateResetToken: asyncControllerWrapper(async (req, res) => {
    await authService.validateResetPasswordToken(req.body);
    sendResponse(200, "Reset token validated")(req, res);
  }),

  /**
   * Reset user password
   * @param {Object} req - Express request object
   * @param {Object} req.body - Should contain new password and token
   */
  resetPassword: asyncControllerWrapper(async (req, res) => {
    await authService.resetPassword(req.body);
    sendResponse(200, "Password reset successfully")(req, res);
  }),

  refreshToken: asyncControllerWrapper(async (req, res) => {
    const token = await authService.refreshToken(req.body);
    sendResponse(200, "Token refreshed successfully", token)(req, res);
  }),
};

module.exports = authController;
