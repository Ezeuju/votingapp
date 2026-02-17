const router = require("express").Router();
const { isLoggedIn } = require("../../middleware/auth");
const deviceController = require("../../controllers/devices");
const adminDeviceController = require("../../controllers/devices/admin");

router.get("/", isLoggedIn, deviceController.read);
router.get("/admin", isLoggedIn, adminDeviceController.read);

module.exports = router;
