const router = require("express").Router();
const { isLoggedIn, isLoggedInAdmin } = require("../../middleware/auth");
const userController = require("../../controllers/users");

router.get("/me", isLoggedIn, userController.readSingle);
router.delete("/me", isLoggedIn, userController.deleteSingle);

// User routes
router.post("/", isLoggedInAdmin, userController.create);
router.get("/", isLoggedInAdmin, userController.readAll);
router.get("/:id", isLoggedIn, userController.readSingle);
router.put("/:id", isLoggedInAdmin, userController.update);

module.exports = router;
