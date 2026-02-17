const mongoose = require("mongoose");

const exampleModel = new mongoose.Schema(
  {
    is_archived: {
      type: Boolean,
      default: false,
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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

exampleModel.index({
  num: "text",
  title: "text",
  description: "text",
  user_id: "text",
  is_archived: "text",
});

module.exports = mongoose.model("Example", exampleModel);
