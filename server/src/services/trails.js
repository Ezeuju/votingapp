const { trailModel } = require("../models");
const validation = require("./validation/trail");
const BaseService = require("./base");
const adminService = require("./admins");
const helpers = require("../utils/helpers");
const { asyncLibWrapper, wrapper } = require("../utils/wrappers");

class TrailService extends BaseService {
  constructor() {
    super(trailModel, validation);
  }

  log = wrapper(async (params) => {
    //validate create
    const { error } = validation.create(params);
    if (error) throw new Error(error.details[0].message);

    //get user
    const admin = await adminService.adminExist(params.admin_id);

    if (!admin) throw new Error("Admin does not exist to log trail.");

    //create log
    await trailModel.create({
      resource: params.resource,
      admin_id: params.admin_id,
      action: params.action,
      metadata: params.metadata,
      adminSnapshot: { ...admin, status: admin.account_status },
    });
  });

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
      resource: 1,
      admin_id: 1,
      action: 1,
      metadata: 1,
      adminSnapshot: {
        first_name: 1,
        last_name: 1,
        email: 1,
        role: 1,
        status: 1,
      },
      "admin.first_name": 1,
      "admin.last_name": 1,
      "admin.email": 1,
      "admin.role": 1,
      "admin.status": "$admin.account_status",
    };
  }

  // Example usage of update with selectFields parameter
  updateExample = asyncLibWrapper(async (params) => {
    const selectFields = "title description user_id"; // Only select specific fields
    return this.update(params, selectFields);
  });

  _getDefaultQuery() {
    return {};
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { resource: searchRegex },
          { action: searchRegex },
          { metadata: searchRegex },
        ],
      },
    };
  }

  _getLookups() {
    return [
      {
        $lookup: {
          from: "admins", // target collection
          localField: "admin_id", // local field
          foreignField: "_id", // foreign field
          as: "admin", // output array field
        },
      },
      {
        $unwind: {
          path: "$admin",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }
}

module.exports = new TrailService();
