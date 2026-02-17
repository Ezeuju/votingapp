const router = require("express").Router();
const { isLoggedIn, isLoggedInAdmin } = require("../../middleware/auth");
const notificationController = require("../../controllers/notifications");
const admin = require("../../controllers/notifications/admin");
const user = require("../../controllers/notifications/user");

// Notification routes (all require authentication)
router.get("/", isLoggedIn, notificationController.read);
router.delete(
  "/:notification_id",
  isLoggedIn,
  notificationController.deleteSingle
);

router.get("/unread/admins", isLoggedInAdmin, admin.unread);
router.get("/unread/users", isLoggedIn, user.unread);

router.get("/users", isLoggedIn, user.read);
router.get("/admins", isLoggedInAdmin, admin.read);

router.post("/mark-read", isLoggedIn, notificationController.markRead);

router.delete(
  "/:notification_id",
  isLoggedIn,
  notificationController.deleteSingle
);

module.exports = router;
