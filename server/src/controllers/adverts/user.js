const advertService = require("../../services/adverts");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const advertController = {
  read: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;
    params["$or"] = [
      { target_app: ["Rider"] },
      { target_app: { $all: ["Driver", "Rider"] } },
    ];

    const data = await advertService.read(params);
    sendResponse(200, "Success.", data)(req, res);
  })
};

module.exports = advertController;
