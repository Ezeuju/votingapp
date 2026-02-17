const express = require("express");
const paymentController = require("../../controllers/payments");

const router = express.Router();

router.post("/initialize", paymentController.initialize);
router.get("/verify", paymentController.verify);
router.post("/webhook", paymentController.webhook);

module.exports = router;
