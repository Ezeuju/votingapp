const { sendResponse } = require("../../utils/helpers");
const NotificationService = require("../../services/notifications");
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
    const data = await NotificationService.read(
      req.query,
      req.user.currentUser
    );
    sendResponse(200, "Notifications retrieved successfully", data[0])(req, res);
  }),

  /**
   * Delete a single notification
   * @param {Object} req - Express request object
   * @param {Object} req.params.notification_id - Notification ID to delete
   * @param {Object} req.user.currentUser - Authenticated user
   */
  deleteSingle: asyncControllerWrapper(async (req, res) => {
    const { notification_id } = req.params;
    await NotificationService.delete(
      { id: notification_id },
      req.user.currentUser
    );
    sendResponse(200, "Notification deleted successfully")(req, res);
  }),

  markRead: asyncControllerWrapper(async (req, res) => {
    await NotificationService.markRead({
      notification_id: req.body.notification_id,
    });

    sendResponse(200, "Success.")(req, res);
  }),
};

module.exports = notificationController;
