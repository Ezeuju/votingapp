const { AppError } = require("../middleware/error");
const { userModel } = require("../models");
const validation = require("./validation/user");
const { asyncLibWrapper } = require("../utils/wrappers");
const helpers = require("../utils/helpers");
const BaseService = require("./base");
const serviceRegistry = require("./serviceRegistry");

class UserService extends BaseService {
  constructor() {
    super(userModel, validation);

    serviceRegistry.register(this);
  }

  // You can still override other methods as needed
  _getProjectionFields(download) {
    return {
      date: download
        ? {
            $dateToString: {
              date: "$createdAt",
              format: "%d-%m-%Y %H:%M",
            },
          }
        : "$createdAt",
      first_name: 1,
      last_name: 1,
      email: 1,
      phone: 1,
      state: 1,
    };
  }

  _getDefaultQuery() {
    return {
      is_deleted: false,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { phone: searchRegex },
          { first_name: searchRegex },
          { last_name: searchRegex },
        ],
      },
    };
  }

  userExist = asyncLibWrapper(async (id, selectProperties) => {
    if (!id) throw new Error("Invalid user identifier");

    const orConditions = helpers.buildIdentifierConditions(id);
    if (orConditions.length === 0) {
      throw new Error("No valid identifier format provided");
    }

    let query = userModel.findOne({ $or: orConditions });
    if (selectProperties) query = query.select(selectProperties);
    return query;
  });

  /**
   * Checks if a field value is available (not taken by another user)
   * @param {string} field - Field name to check
   * @param {string} value - Field value
   * @param {string} userId - Current user ID to exclude
   */
  checkFieldAvailability = async (field, value, userId) => {
    if (!value) return;

    const exists = await userModel.findOne({
      [field]: value.trim().toLowerCase(),
      _id: { $ne: userId },
      [field]: { $exists: true, $ne: "" },
    });

    if (exists) {
      throw new AppError(
        409,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already taken.`
      );
    }
  };

  /**
   * Updates user status with admin validation
   * @param {Object} params - Contains user_id, admin_id, and status
   * @returns {Promise<Object>} Updated user document
   */
  updateStatus = asyncLibWrapper(async ({ user_id, admin_id, status }) => {
    if (status === null) throw new AppError(400, "'status' is required.");
    if (user_id === admin_id) {
      throw new AppError(403, "You are not allowed to perform this action.");
    }

    const user = await userModel.findById(user_id);
    if (!user) throw new AppError(404, "Record not found.");

    const updated = await userModel.findByIdAndUpdate(user_id, { status });
    if (!updated) throw new AppError(500, "Internal server error.");
    return updated;
  });

  tempDeleteAccount = asyncLibWrapper(async (params) => {
    const { error } = validation.deleteAccount(params);

    if (error) throw new AppError(400, error.details[0].message);

    const user = await this.model.findById(params.id);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const deleted_user = await userModel.findByIdAndUpdate(user._id, {
      $set: {
        status: false,
        init_delete: true,
        init_delete_at: new Date(),
        deletion_reason: params?.deletion_reason,
      },
    });

    if (!deleted_user) {
      throw new AppError(500, "Unable to delete account, please try again.");
    }

    return true;
  });
}

module.exports = new UserService();
