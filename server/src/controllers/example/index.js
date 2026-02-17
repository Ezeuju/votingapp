const exampleService = require("../../services/example");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

/**
 * Example CRUD Controller
 *
 * Handles basic CRUD operations with:
 * - Create, Read, Update, Delete functionality
 * - CSV download capability for read operations
 * - Authentication and authorization checks
 */
const exampleController = {
  /**
   * Create a new example record
   * @param {Object} req - Express request object
   * @param {Object} req.body - Data for new record
   * @param {Object} req.user.currentUser - Authenticated user
   */
  create: asyncControllerWrapper(async (req, res) => {
    await exampleService.create(req.body, req.user.currentUser);
    sendResponse(201, "Example created successfully")(req, res);
  }),

  /**
   * Retrieve example records with optional CSV download
   * @param {Object} req - Express request object
   * @param {Object} req.query - Filter parameters
   * @param {boolean} [req.query.download] - Flag to trigger CSV download
   */
  read: asyncControllerWrapper(async (req, res) => {
    const data = await exampleService.read(req.query);

    if (req.query.download) {
      return res
        .status(200)
        .attachment("examples.csv")
        .type("text/csv")
        .send(data);
    }

    sendResponse(200, "Examples retrieved successfully", data[0])(req, res);
  }),

  /**
   * Get a single example record by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  readSingle: asyncControllerWrapper(async (req, res) => {
    const data = await exampleService.readSingle(
      req.params,
      req.user.currentUser
    );
    sendResponse(200, "Example retrieved successfully", data)(req, res);
  }),

  /**
   * Update an existing example record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.body - Updated data
   * @param {Object} req.user.currentUser - Authenticated user
   */
  update: asyncControllerWrapper(async (req, res) => {
    await exampleService.update(
      { ...req.body, id: req.params.id },
      req.user.currentUser
    );
    sendResponse(200, "Example updated successfully")(req, res);
  }),

  /**
   * Delete an example record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  delete: asyncControllerWrapper(async (req, res) => {
    await exampleService.delete(req.params, req.user.currentUser);
    sendResponse(200, "Example deleted successfully")(req, res);
  }),
};

module.exports = exampleController;
