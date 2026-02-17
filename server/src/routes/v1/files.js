const router = require("express").Router();
const upload = require("../../middleware/upload");
const { isLoggedIn } = require("../../middleware/auth");

const { create } = require("../../controllers/files");

router.post("/", isLoggedIn, upload.single("file"), create);

module.exports = router;
