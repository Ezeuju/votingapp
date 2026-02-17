const { AppError } = require("../middleware/error");
const { asyncLibWrapper } = require("../utils/wrappers");
const { listToCsv } = require("../utils/listToCsv");
const helpers = require("../utils/helpers");
const serviceRegistry = require("./serviceRegistry");

class BaseService {
  constructor(model, validation) {
    this.model = model;
    this.validation = validation;

    // Dynamically create resource name based on the class name (removing 'Service' suffix)
    const className = this.constructor.name;
    this.resourceName =
      this.resourceName ||
      (className.endsWith("Service") ? className.slice(0, -7) : className);
  }

  create = asyncLibWrapper(async (params) => {
    const { error } = this.validation.create(params);
    if (error) throw new AppError(400, error.details[0].message);

    const doc = await this.model.create(params);
    if (!doc) throw new AppError(500, "Internal server error.");
    return doc;
  });

  read = asyncLibWrapper(async (params = {}) => {
    const {
      pageNo,
      limitNo,
      filter = "createdAt",
      order = "-1",
      fromDate,
      toDate,
      search,
      download,
      dateField = "createdAt",
      projection,
      groupBy,
      ...restParams
    } = params;

    const dateRangeQuery =
      fromDate && toDate
        ? { [dateField]: helpers.buildDateRangeQuery(fromDate, toDate) }
        : {};

    const query = {
      ...this._getDefaultQuery(),
      ...dateRangeQuery,
      ...(() => {
        const entries = Object.entries(restParams).filter(
          ([, v]) => typeof v !== "undefined"
        );
        const filteredEntries = entries.filter(([key]) => key !== "columns");
        return Object.fromEntries(filteredEntries);
      })(),
    };

    const finalProjection = projection || this._getProjectionFields(download);

    const pipeline = [
      ...this._getPreMatchLookups(), // Pre-match lookups to enable filtering on joined fields
      { $match: query }, // Match after those lookups
      ...this._getLookups(params), // Other lookups after match
      helpers.getSortOptions(filter, order),
      { $project: finalProjection },
    ];

    if (search) pipeline.push(this._buildSearchStage(search));

    if (groupBy) {
      const groupFields = Array.isArray(groupBy) ? groupBy : [groupBy];

      pipeline.push({
        $group: {
          _id: groupFields.reduce((acc, field) => {
            acc[field] = `$${field}`;
            return acc;
          }, {}),
          doc: { $first: "$$ROOT" }, // first doc in group
        },
      });

      pipeline.push({
        $replaceRoot: { newRoot: "$doc" },
      });
    }

    if (download) return listToCsv(params, this.model, pipeline);

    const data = await this.model.aggregate([
      ...pipeline,
      ...helpers.buildPaginationStages(pageNo, limitNo),
    ]);
    
    return data;
  });

  readSingle = asyncLibWrapper(async ({ id }, selectFields = null) => {
    const doc = await this.model.findById(id).select(selectFields).lean();
    if (!doc) throw new AppError(404, "Record not found.");
    return doc;
  });

  update = asyncLibWrapper(async (params, selectFields = null) => {
    const { error } = this.validation.update(params);
    if (error) throw new AppError(400, error.details[0].message);

    const doc = await this.model.findById(params.id);
    if (!doc) throw new AppError(404, "Record not found.");

    const update_query = this.model.findByIdAndUpdate(
      params.id,
      { $set: params },
      { new: true }
    );

    // Apply select fields if provided
    if (selectFields) {
      update_query.select(selectFields);
    }

    const updated = await update_query;

    if (!updated) throw new AppError(500, "Internal server error.");

    return updated;
  });

  delete = asyncLibWrapper(async ({ id }, selectFields = null) => {
    const doc = await this.model.findById(id);
    if (!doc) throw new AppError(404, "Record not found.");

    const deleted = await this.model.findByIdAndDelete(id).select(selectFields);
    if (!deleted) throw new AppError(500, "Internal server error.");
    return deleted;
  });

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { role: searchRegex },
          { status: searchRegex },
        ],
      },
    };
  }

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

  _getDefaultQuery() {
    return {
      is_deleted: false,
      is_archived: false,
    };
  }

  _getLookups() {
    return []; // By default, no lookups
  }

  _getPreMatchLookups() {
    // By default, no pre-match lookups
    return [];
  }

  deleteAccount = asyncLibWrapper(async (params) => {
    // Let the specific service decide what to do with its own model
    const services = serviceRegistry.getAll();

    for (const service of services) {
      if (typeof service._deleteAccountHandler === "function") {
        await service._deleteAccountHandler(params);
      }
    }

    return true;
  });

  /**
   * Default behavior (can be overridden)
   * - If model has user_id: set to null
   * - If personal fields exist: anonymize
   */
  async _deleteAccountHandler(params) {
    // here you can anonymize the models asociated with the respective accounts.
    return params;
  }
}

module.exports = BaseService;
