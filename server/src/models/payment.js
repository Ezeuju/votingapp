const mongoose = require("mongoose");

const paymentModel = new mongoose.Schema(
  {
    is_archived: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "abandoned", "reversed"],
      default: "pending",
    },
    audition_plan_id: {
      type: mongoose.Types.ObjectId,
      ref: "plan",
    },
    ticket_plan_id: {
      type: mongoose.Types.ObjectId,
      ref: "plan",
    },
    payment_gateway: {
      type: String,
      default: "paystack",
    },
    metadata: {
      first_name: String,
      last_name: String,
      email: String,
      country: String,
      street_address: String,
      town: String,
      state: String,
      audition_plan_id: {
        type: mongoose.Types.ObjectId,
        ref: "plan",
      },
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    gateway_response: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

paymentModel.index({
  reference: "text",
  status: "text",
  payment_gateway: "text",
});

module.exports = mongoose.model("Payment", paymentModel);
