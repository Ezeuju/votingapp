const adminService = require("../lib/admins");
const { sendResponse } = require("../utils/helpers");
const { asyncControllerWrapper } = require("../utils/wrappers");

/**
 * Handles admin-related operations including CRUD and status management.
 * All methods are wrapped with error handling and standardized response formatting.
 */
const adminController = {
  /**
   * Creates a new admin record after validating permissions
   * @param {Object} req - Express request object containing admin data and current user
   */
  create: asyncControllerWrapper(async (req, res) => {
    const {
      body: params,
      user: { currentUser },
    } = req;
    const data = await adminService.create(params, currentUser);
    sendResponse(201, "Admin created successfully", data)(req, res);
  }),

  /**
   * Retrieves admin records with optional CSV export
   * @param {Object} req - Express request object containing query parameters
   */
  read: asyncControllerWrapper(async (req, res) => {
    const { query: params } = req;
    const data = await adminService.read(params);

    if (params.download) {
      res.attachment("admins.csv").type("text/csv");
      return res.status(200).send(data);
    }

    return sendResponse(
      200,
      "Admins retrieved successfully",
      data
    )(req, res);
  }),

  /**
   * Retrieves a single admin record with permission validation
   * @param {Object} req - Express request object containing admin ID and current user
   */
  readSingle: asyncControllerWrapper(async (req, res) => {
    const {
      params,
      user: { currentUser },
    } = req;
    const data = await adminService.readSingle(params, currentUser);
    return sendResponse(200, "Admin details retrieved", data)(req, res);
  }),

  /**
   * Updates an admin record after validating permissions
   * @param {Object} req - Express request object containing update data and current user
   */
  update: asyncControllerWrapper(async (req, res) => {
    const {
      body: params,
      user: { currentUser },
    } = req;
    const data = await adminService.update(params, currentUser);
    sendResponse(200, "Admin updated successfully", data)(req, res);
  }),

  /**
   * Updates admin status (active/inactive) with permission validation
   * @param {Object} req - Express request object containing status data and current user
   */
  updateStatus: asyncControllerWrapper(async (req, res) => {
    const {
      body: params,
      user: { currentUser },
    } = req;
    const data = await adminService.updateStatus(params, currentUser);
    sendResponse(200, "Admin status updated", data)(req, res);
  }),
};

module.exports = adminController;
