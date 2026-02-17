const { planModel } = require("../models");
const validation = require("./validation/plan");
const BaseService = require("./base");
const helpers = require("../utils/helpers");
const { asyncLibWrapper } = require("../utils/wrappers");

class PlanService extends BaseService {
  constructor() {
    super(planModel, validation);
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
      type: 1,
      title: 1,
      description: 1,
      amount: 1,
    };
  }

  // plan usage of update with selectFields parameter
  updatePlan = asyncLibWrapper(async (params) => {
    const selectFields = "type title description user_id"; // Only select specific fields
    return this.update(params, selectFields);
  });

  _getDefaultQuery() {
    return {
      is_archived: false,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
        ],
      },
    };
  }
}

module.exports = new PlanService();
