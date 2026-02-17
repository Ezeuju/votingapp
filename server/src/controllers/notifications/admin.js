const { sendResponse } = require("../../utils/helpers");
const notificationService = require("../../services/notifications");
const { asyncControllerWrapper } = require("../../utils/wrappers");

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

    const data = await notificationService.read(params);

    if (params.download) {
      return res
        .status(200)
        .attachment("notifications.csv")
        .type("text/csv")
        .send(data);
    }

    sendResponse(200, "Success.", data[0])(req, res);
  }),

  unread: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;
    params["user_id"] = req.user.currentUser._id;

    const data = await notificationService.unread(params);

    sendResponse(200, "Success.", data)(req, res);
  }),
};

module.exports = notificationController;
