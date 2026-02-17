const { exampleModel } = require("../models");
const validation = require("./validation/example");
const BaseService = require("./base");
const helpers = require("../utils/helpers");
const { asyncLibWrapper } = require("../utils/wrappers");

class ExampleService extends BaseService {
  constructor() {
    super(exampleModel, validation);
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
      title: 1,
      description: 1,
      user_id: 1,
    };
  }

  // Example usage of update with selectFields parameter
  updateExample = asyncLibWrapper(async (params) => {
    const selectFields = "title description user_id"; // Only select specific fields
    return this.update(params, selectFields);
  });

  _getDefaultQuery() {
    return {
      is_deleted: false,
      is_archived: false,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { role: searchRegex },
        ],
      },
    };
  }
}

module.exports = new ExampleService();
