const router = require("express").Router();
const { isLoggedIn, isLoggedInAdmin } = require("../../middleware/auth");
const userController = require("../../controllers/users");
const admin = require("../../controllers/users/admin");

router.get("/me", isLoggedIn, userController.readSingle);
router.delete("/me", isLoggedIn, userController.deleteSingle);

// Admin routes
router.post("/", isLoggedInAdmin, userController.create);
router.post("/audition/admin", admin.addAudition);
router.get("/admin", admin.read);
router.get("/audition/stats/admin", admin.getAuditionStats);
router.get("/:id/admin", admin.readSingle);
router.patch("/:id/audition/admin", admin.confirmRegistration);
router.delete("/:id/audition/admin", admin.deleteAuditionRecord);
// router.put("/:id", isLoggedInAdmin, userController.update);

module.exports = router;
