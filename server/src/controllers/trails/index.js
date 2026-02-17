const trailService = require("../../services/trails");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

/**
 * Trail Controller
 *
 * Handles trail-related operations including:
 * - Retrieving trails with optional CSV download
 */
const trailController = {
  read: asyncControllerWrapper(async (req, res) => {
    const data = await trailService.read(req.sanitizedQuery);
    if (req.query.download) {
      return res
        .status(200)
        .attachment("trails.csv")
        .type("text/csv")
        .send(data);
    }

    return sendResponse(200, "Trails retrieved successfully", data)(req, res);
  }),
};

module.exports = trailController;