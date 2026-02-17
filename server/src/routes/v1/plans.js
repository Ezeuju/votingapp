const router = require("express").Router();
// const { isLoggedIn } = require("../../middleware/auth");
const planController = require("../../controllers/plans");

router.post("/", planController.create);
router.get("/", planController.read);

module.exports = router;
