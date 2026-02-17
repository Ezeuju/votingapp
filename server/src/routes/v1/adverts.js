const router = require("express").Router();
const { isLoggedIn, isLoggedInAdmin, isLoggedInSuperAdmin, isLoggedInDriver } = require("../../middleware/auth");
const advertController = require("../../controllers/adverts");
const driver = require("../../controllers/adverts/driver");
const user = require("../../controllers/adverts/user");

// user routes
router.get("/users/display", isLoggedIn, user.read);

// driver route
router.get("/drivers/display", isLoggedInDriver, driver.read);

// admin routes
router.post("/", isLoggedInAdmin, advertController.create);
router.get("/", isLoggedInAdmin, advertController.read);
router.get("/:advert_id", isLoggedInAdmin, advertController.readSingle);
router.patch("/:advert_id", isLoggedInAdmin, advertController.update);
router.delete("/:advert_id", isLoggedInSuperAdmin, advertController.delete);

// public routes for driver and rider
router.post("/record-click", isLoggedIn, advertController.recordClicks);
router.post("/record-views", isLoggedIn, advertController.recordViews);

module.exports = router;