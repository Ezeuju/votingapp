const deviceService = require("../../services/devices");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const deviceController = {
  read: asyncControllerWrapper(async (req, res) => {
    const data = await deviceService.read({
      ...req.query,
    });

    if (req.query.download) {
      res.attachment("devices.csv");
      return res.status(200).send(data);
    }

    sendResponse(200, "Successfull", data[0])(req, res);
  }),
};

module.exports = deviceController;
