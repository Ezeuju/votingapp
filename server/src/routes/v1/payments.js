const express = require("express");
const paymentController = require("../../controllers/payments");
const admin = require("../../controllers/payments/admin");

const router = express.Router();

router.post("/initialize", paymentController.initialize);
router.get("/verify", paymentController.verify);
router.post("/webhook", paymentController.webhook);

// admin routes
router.get("/auditions/admin", admin.readAuditionRegistrations);

module.exports = router;
