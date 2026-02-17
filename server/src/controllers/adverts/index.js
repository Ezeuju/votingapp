const advertService = require("../../services/adverts");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

/**
 * advert CRUD Controller
 *
 * Handles basic CRUD operations with:
 * - Create, Read, Update, Delete functionality
 * - CSV download capability for read operations
 * - Authentication and authorization checks
 */
const advertController = {
  /**
   * Create a new advert record
   * @param {Object} req - Express request object
   * @param {Object} req.body - Data for new record
   * @param {Object} req.user.currentUser - Authenticated user
   */
  create: asyncControllerWrapper(async (req, res) => {
    await advertService.create(req.body, req.user.currentUser);
    sendResponse(201, "Success.")(req, res);
  }),

  /**
   * Retrieve advert records with optional CSV download
   * @param {Object} req - Express request object
   * @param {Object} req.query - Filter parameters
   * @param {boolean} [req.query.download] - Flag to trigger CSV download
   */
  read: asyncControllerWrapper(async (req, res) => {
    const data = await advertService.read(req.query);

    if (req.query.download) {
      return res
        .status(200)
        .attachment("adverts.csv")
        .type("text/csv")
        .send(data);
    }

    sendResponse(200, "Success.", data[0])(req, res);
  }),

  /**
   * Get a single advert record by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  readSingle: asyncControllerWrapper(async (req, res) => {
    const data = await advertService.readSingle({ id: req.params.advert_id });
    sendResponse(200, "Success.", data)(req, res);
  }),

  /**
   * Update an existing advert record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.body - Updated data
   * @param {Object} req.user.currentUser - Authenticated user
   */
  update: asyncControllerWrapper(async (req, res) => {
    const data = await advertService.update({
      ...req.body,
      id: req.params.advert_id,
    });
    sendResponse(200, "Success.", data)(req, res);
  }),

  /**
   * Delete an advert record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  delete: asyncControllerWrapper(async (req, res) => {
    await advertService.delete({ id: req.params.advert_id });
    sendResponse(200, "Success.")(req, res);
  }),

  recordClicks: asyncControllerWrapper(async (req, res) => {
    await advertService.recordClicks({ advert_id: req.body.advert_id });
    sendResponse(200, "Success.")(req, res);
  }),

  recordViews: asyncControllerWrapper(async (req, res) => {
    await advertService.recordViews({ advert_id: req.body.advert_id });

    sendResponse(200, "Success.")(req, res);
  }),
};

module.exports = advertController;
