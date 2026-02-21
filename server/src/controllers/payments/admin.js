const PaymentService = require("../../services/payments");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const paymentController = {
  readAuditionRegistrations: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;

    const data = await PaymentService.read(params);
    sendResponse(200, "Payment initialized successfully", data)(req, res);
  })
};

module.exports = paymentController;
