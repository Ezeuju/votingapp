const { AppError } = require("../middleware/error");
const { userModel, paymentModel, planModel } = require("../models");
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
      country: 1,
      audition_plan: "$audition_plan.title",
      account_status: 1,
      account_type: 1,
      location: 1,
    };
  }

  _getDefaultQuery() {
    return {
      is_deleted: false,
      status: true,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { email: searchRegex },
          { first_name: searchRegex },
          { last_name: searchRegex },
          { country: searchRegex },
          { state: searchRegex },
          { audition_plan: searchRegex },
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
        `${field.charAt(0).toUpperCase() + field.slice(1)} already taken.`,
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

  confirmRegistration = asyncLibWrapper(async (params) => {
    const { user_id, account_status } = params;

    const user = await this.model.findById(user_id);

    if (!user) {
      throw new AppError(404, "Sorry no registration record for this user.");
    }

    // check if payment is successful
    const success_payment = await paymentModel.findOne({
      user_id: user._id,
      audition_plan_id: user.audition_plan_id,
      status: "success",
    });

    if (!success_payment) {
      throw new AppError(
        400,
        "The payment for this user is not successful, please investigate",
      );
    }

    const updated_user = await this.model.findByIdAndUpdate(user_id, {
      account_status,
    });

    if (!updated_user) {
      throw new AppError(
        500,
        "Sorry unable to confirm audition registration at this time.",
      );
    }

    return updated_user;
  });

  deleteAuditionRecord = asyncLibWrapper(async (user_id) => {
    const user = await this.model.findById(user_id);
    if (!user) throw new AppError(404, "Audition record not found.");

    await this.model.findByIdAndUpdate(user_id, { status: false });
    return true;
  });

  addAudition = asyncLibWrapper(async (params) => {
    const { error } = validation.addAudition(params);
    if (error) throw new AppError(400, error.details[0].message);

    const existingUser = await userModel.findOne({ email: params.email });
    if (existingUser)
      throw new AppError(
        400,
        "This email has already been registered  for audition",
      );

    const user = await userModel.create({
      ...params,
      account_type: "Applicant",
      account_status: "Confirmed",
      created_by_admin: true,
    });

    return user;
  });

  getAuditionStats = asyncLibWrapper(async () => {
    const plans = await planModel.find({ type: "audition" });
    const planMap = {};
    plans.forEach((plan) => {
      planMap[plan._id.toString()] = plan.title.toLowerCase();
    });

    const stats = await userModel.aggregate([
      {
        $match: { is_deleted: false, account_type: "Applicant", status: true },
      },
      {
        $facet: {
          total_registrations: [{ $count: "count" }],
          total_confirmed: [
            { $match: { account_status: "Confirmed" } },
            { $count: "count" },
          ],
          total_pending: [
            { $match: { account_status: "Pending" } },
            { $count: "count" },
          ],
          by_plan: [
            { $group: { _id: "$audition_plan_id", count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    const result = {
      total_registrations: stats[0].total_registrations[0]?.count || 0,
      total_confirmed: stats[0].total_confirmed[0]?.count || 0,
      total_pending: stats[0].total_pending[0]?.count || 0,
      total_silver: 0,
      total_gold: 0,
      total_vip: 0,
    };

    stats[0].by_plan.forEach((item) => {
      const planName = planMap[item._id?.toString()];
      if (planName?.includes("silver")) result.total_silver = item.count;
      else if (planName?.includes("gold")) result.total_gold = item.count;
      else if (planName?.includes("vip")) result.total_vip = item.count;
    });

    return result;
  });

  _getLookups() {
    return [
      {
        $lookup: {
          from: "plans",
          localField: "audition_plan_id",
          foreignField: "_id",
          as: "audition_plan",
        },
      },
      {
        $unwind: {
          path: "$audition_plan",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }
}

module.exports = new UserService();
