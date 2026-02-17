const { deviceModel } = require("../models");
const validation = require("./validation/devices");
const { asyncLibWrapper } = require("../utils/wrappers");
const BaseService = require("./base");
const serviceRegistry = require("./serviceRegistry");

class DeviceService extends BaseService {
  constructor() {
    super(deviceModel, validation);
    serviceRegistry.register(this);
  }

  _getProjectionFields() {
    return {
      meta: 0,
      _id: 0,
    };
  }

  _getDefaultQuery() {
    return {
      is_active: true,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    return {
      $match: {
        $or: [
          { device_type: searchRegex },
          { device_platform: searchRegex },
          { device_browser: searchRegex },
          { device_OS: searchRegex },
          { device_model: searchRegex },
        ],
      },
    };
  }

  create = asyncLibWrapper(async (params) => {
    const { error } = validation.validateAddDevice(params);
    if (error) return false;

    if (params?.region === "") delete params.region;
    if (params?.country === "") delete params.country;

    let device = await deviceModel.findOne({
      device_id: params.device_id,
      user_id: params.user_id,
    });

    if (device) {
      const updateFields = { ...params };
      delete updateFields.device_id;
      delete updateFields.user_id;
      delete updateFields.device_type;
      delete updateFields.device_platform;
      delete updateFields.device_OS;
      delete updateFields.device_model;

      await deviceModel.findByIdAndUpdate(device._id, {
        $set: {
          ...updateFields,
          is_active: true,
          lastActive: new Date(),
        },
      });
      return true;
    }

    device = await deviceModel.create({ ...params });
    if (!device) return false;

    return true;
  });

  readByDeviceID = asyncLibWrapper(async (device_id, user_id = null) => {
    const query = { device_id };
    if (user_id) query.user_id = user_id;

    const device = await deviceModel.findOne(query).select("-meta").lean();
    return device || false;
  });
}

module.exports = new DeviceService();
