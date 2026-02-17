const router = require("express").Router();

const { sendResponse } = require("../utils/helpers");
const health = require("./v1/health");
const example = require("./v1/example");
const users = require("./v1/users");
const auth = require("./v1/auth");
const devices = require("./v1/devices");
const files = require("./v1/files");
const notification = require("./v1/notifications");
const plans = require("./v1/plans");
const payments = require("./v1/payments");

router.use("/v1/examples", example);
router.use("/v1/users", users);
router.use("/v1/auths", auth);
router.use("/v1/devices", devices);
router.use("/v1/notifications", notification);
router.use("/v1/health", health);
router.use("/v1/files", files);
router.use("/v1/plans", plans);
router.use("/v1/payments", payments);

// handling route 404 errors
router.use((req, res) => {
  sendResponse(404, `Cannot ${req.method} ${req.originalUrl}`)(req, res);
});

module.exports = router;
