const mongoose = require("mongoose");

const planModel = new mongoose.Schema(
  {
    is_archived: {
      type: Boolean,
      default: false,
      required: true,
    },
    type: {
      type: String,
      enum: ["ticket", "audition"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
  },
  {
    timestamps: true,
  },
);

planModel.index({
  num: "text",
  title: "text",
  description: "text",
  user_id: "text",
  is_archived: "text",
  type: "text",
});

module.exports = mongoose.model("plan", planModel);
