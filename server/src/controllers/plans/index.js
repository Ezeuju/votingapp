const PlanService = require("../../services/plans");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

/**
 * plan CRUD Controller
 *
 * Handles basic CRUD operations with:
 * - Create, Read, Update, Delete functionality
 * - CSV download capability for read operations
 * - Authentication and authorization checks
 */
const planController = {
  /**
   * Create a new plan record
   * @param {Object} req - Express request object
   * @param {Object} req.body - Data for new record
   * @param {Object} req.user.currentUser - Authenticated user
   */
  create: asyncControllerWrapper(async (req, res) => {
    await PlanService.create(req.body);
    sendResponse(201, "Plan created successfully")(req, res);
  }),

  /**
   * Retrieve plan records with optional CSV download
   * @param {Object} req - Express request object
   * @param {Object} req.query - Filter parameters
   * @param {boolean} [req.query.download] - Flag to trigger CSV download
   */
  read: asyncControllerWrapper(async (req, res) => {
    const data = await PlanService.read(req.query);

    if (req.query.download) {
      return res
        .status(200)
        .attachment("plans.csv")
        .type("text/csv")
        .send(data);
    }

    sendResponse(200, "Plans retrieved successfully", data[0])(req, res);
  }),

  /**
   * Get a single plan record by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  readSingle: asyncControllerWrapper(async (req, res) => {
    const data = await PlanService.readSingle(
      req.params,
      req.user.currentUser
    );
    sendResponse(200, "Plan retrieved successfully", data)(req, res);
  }),

  /**
   * Update an existing plan record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.body - Updated data
   * @param {Object} req.user.currentUser - Authenticated user
   */
  update: asyncControllerWrapper(async (req, res) => {
    await PlanService.update(
      { ...req.body, id: req.params.id },
      req.user.currentUser
    );
    sendResponse(200, "Plan updated successfully")(req, res);
  }),

  /**
   * Delete a plan record
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains record ID
   * @param {Object} req.user.currentUser - Authenticated user
   */
  delete: asyncControllerWrapper(async (req, res) => {
    await PlanService.delete(req.params, req.user.currentUser);
    sendResponse(200, "Plan deleted successfully")(req, res);
  }),
};

module.exports = planController;
