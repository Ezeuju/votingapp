const PaymentService = require("../../services/payments");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const paymentController = {
  initialize: asyncControllerWrapper(async (req, res) => {
    const data = await PaymentService.initializePayment(req.body);
    sendResponse(200, "Payment initialized successfully", data)(req, res);
  }),

  verify: asyncControllerWrapper(async (req, res) => {
    await PaymentService.verifyPayment(req.query);
    sendResponse(200, "Successfully.")(req, res);
  }),

  webhook: asyncControllerWrapper(async (req, res) => {
    const signature = req.headers["x-paystack-signature"];
    await PaymentService.handleWebhook(req.body, signature);
    res.status(200).send("Ok");
  }),
};

module.exports = paymentController;
