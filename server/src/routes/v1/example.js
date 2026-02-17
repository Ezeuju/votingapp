const router = require("express").Router();
const { isLoggedIn } = require("../../middleware/auth");
const exampleController = require("../../controllers/example");

router.post("/", isLoggedIn, exampleController.create);

module.exports = router;
