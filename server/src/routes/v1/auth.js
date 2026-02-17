const router = require("express").Router();
const { isLoggedIn, deviceTracking, decodeJWTToken } = require("../../middleware/auth");
const authController = require("../../controllers/auth");
const admin = require("../../controllers/auth/admin");
const user = require("../../controllers/auth/user");

const {
  captureClientInfoMiddleware,
} = require("../../middleware/clientInformation");

// admin auth routes
router.post("/admins/login", admin.login);
router.post("/admins/send-otp", admin.sendOTP);
router.post("/admins/verify-otp", admin.verifyOTP);
router.post("/admins/reset-password", admin.resetPassword);

// user auth routes
router.post("/users/devices", authController.registerDevice);
router.post("/users/send-otp", user.sendOTP);
router.post("/users/verify-otp", user.verifyOTP);
router.post(
  "/users/register",
  deviceTracking,
  captureClientInfoMiddleware({ geoProvider: "both" }),
  user.register,
);
router.post(
  "/users/login",
  deviceTracking,
  captureClientInfoMiddleware({ geoProvider: "both" }),
  user.login,
);
router.post("/users/reset-password", user.resetPassword);

router.post("/refresh-token", decodeJWTToken, authController.refreshToken);

// Protected routes (require authentication)
router.post("/users/logout", isLoggedIn, user.logout);
router.post("/users/change-password", isLoggedIn, user.changePassword);
router.post("/admins/change-password", isLoggedIn, admin.changePassword);

module.exports = router;
