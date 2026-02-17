const mongoose = require("mongoose");

const trailModel = new mongoose.Schema(
  {
    resource: {
      // e.g. products, invoices
      type: String,
      required: true,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    action: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    adminSnapshot: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: "active",
      },
    },
  },
  {
    timestamps: true,
  }
);

trailModel.index({
  actions: "text",
  resource: "text",
});

module.exports = mongoose.model("Trail", trailModel);