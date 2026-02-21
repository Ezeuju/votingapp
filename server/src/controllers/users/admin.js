const UserService = require("../../services/users");
const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const userController = {
  /**
   * Create a new user
   * @param {Object} req - Express request object
   * @param {Object} req.body - User data
   */
  create: asyncControllerWrapper(async (req, res) => {
    const user = await UserService.create(req.body);
    sendResponse(201, "User created successfully", user)(req, res);
  }),

  /**
   * Get all users
   * @param {Object} req - Express request object
   */
  read: asyncControllerWrapper(async (req, res) => {
    const params = req.sanitizedQuery;
    const users = await UserService.read(params);

    if (params.download) {
      res.attachment("users.csv").type("text/csv");
      return res.status(200).send(users);
    }

    sendResponse(200, "Users retrieved successfully", users)(req, res);
  }),

  /**
   * Get a single user by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains user ID
   */
  readSingle: asyncControllerWrapper(async (req, res) => {
    const user = await UserService.readSingle(
      { id: req.params.id },
      "-temp -totp -last_activity_at",
    );
    sendResponse(200, "User retrieved successfully", user)(req, res);
  }),

  /**
   * Update a user
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains user ID
   * @param {Object} req.body - Updated user data
   */
  update: asyncControllerWrapper(async (req, res) => {
    const user = await UserService.update({ ...req.body, id: req.params.id });
    sendResponse(200, "User updated successfully", user)(req, res);
  }),

  confirmRegistration: asyncControllerWrapper(async (req, res) => {
    const params = req.body;
    params.user_id = req.params.id;

    await UserService.confirmRegistration(params);

    sendResponse(200, "Successfully.")(req, res);
  }),

  deleteAuditionRecord: asyncControllerWrapper(async (req, res) => {
    await UserService.deleteAuditionRecord(req.params.id);
    sendResponse(200, "User audition deleted successfully.")(req, res);
  }),

  addAudition: asyncControllerWrapper(async (req, res) => {
    const user = await UserService.addAudition(req.body);

    sendResponse(
      201,
      "Audition registration added successfully.",
      user,
    )(req, res);
  }),

  getAuditionStats: asyncControllerWrapper(async (req, res) => {
    const stats = await UserService.getAuditionStats();
    sendResponse(
      200,
      "Audition stats retrieved successfully.",
      stats,
    )(req, res);
  }),

  /**
   * Delete a user
   * @param {Object} req - Express request object
   * @param {Object} req.params - Contains user ID
   */
  deleteSingle: asyncControllerWrapper(async (req, res) => {
    await UserService.tempDeleteAccount({ id: req.user.currentUser._id });
    sendResponse(200, "User deleted successfully.")(req, res);
  }),
};

module.exports = userController;
