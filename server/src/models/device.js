const mongoose = require("mongoose");

const deviceModel = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    device_type: {
      type: String,
      required: true,
    },
    device_platform: {
      type: String,
    },
    device_browser: {
      type: String,
    },
    device_OS: {
      type: String,
    },
    device_model: {
      type: String,
    },
    ip: {
      type: String,
    },
    country: {
      type: String,
    },
    country_code: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    timezone: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    isp: {
      type: String,
    },
    lastActive: {
      type: Date,
      required: false,
    },
    meta: {
      type: Map,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", deviceModel);
