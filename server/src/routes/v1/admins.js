const router = require("express").Router();
const { isLoggedIn } = require("../../middleware/auth");
const adminController = require("../../controllers/admins");

// Admin CRUD routes
router.post("/", isLoggedIn, adminController.create);
router.get("/", isLoggedIn, adminController.read);
router.get("/:id", isLoggedIn, adminController.readSingle);
router.patch("/:id", isLoggedIn, adminController.update);
router.patch("/status", isLoggedIn, adminController.updateStatus);

module.exports = router;