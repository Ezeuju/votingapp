const { sendResponse } = require("../../utils/helpers");
const notificationService = require("../../services/notifications");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const { sendPush } = require("../../services/notifications");
const { validateSendPush } = require("../../services/validation/notification");
const { AppError } = require("../../middleware/error");
const { userModel } = require("../../models");

/**
 * Notification Controller
 *
 * Handles notification-related operations including:
 * - Retrieving notifications
 * - Deleting notifications
 */
const notificationController = {
  /**
   * Get notifications based on query parameters
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {Object} req.user.currentUser - Authenticated user
   */
  read: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;
    params["user_id"] = req.user.currentUser._id;
    params["is_read"] = false;

    const data = await notificationService.read(params);

    sendResponse(200, "Success.", data[0])(req, res);
  }),

  async sendPush(req, res) {
    const params = req.body;
    const user = await userModel.findById(req.user.currentUser._id);

    params.device_id = user.device_id;

    if (!params.device_id) {
      throw new AppError(
        400,
        "No device_id found for the user, please update."
      );
    }

    const { error } = validateSendPush(params);

    if (error) {
      throw new AppError(400, error.details[0].message);
    }

    sendPush(
      params.title,
      params.description,
      params.device_id,
      params.metadata
    );

    return sendResponse(200, "Successful.")(req, res);
  },

  unread: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;
    params["user_id"] = req.user.currentUser._id;

    const data = await notificationService.unread(params);

    sendResponse(200, "Success.", data)(req, res);
  }),
};

module.exports = notificationController;
