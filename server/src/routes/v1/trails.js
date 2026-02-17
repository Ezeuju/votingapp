const router = require("express").Router();
const { isLoggedIn } = require("../../middleware/auth");
const trailController = require("../../controllers/trails");

// Trail routes
router.get("/", isLoggedIn, trailController.read);

module.exports = router;