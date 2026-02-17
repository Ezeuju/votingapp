const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_archived: {
      type: Boolean,
      default: false,
      required: true,
    },
    photo: {
      type: String,
      trim: true,
      default:
        "https://uatdrive.s3.us-west-002.backblazeb2.com/587228_profile_photo.png",
    },
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    type: {
      type: String,
      default: "User",
      required: true,
    },
    role: {
      type: String,
      default: "User",
      required: true,
    },
    account_type: {
      type: String,
      enum: ["Applicant", "Contestant"],
      default: "Applicant",
    },
    country: {
      type: String,
      required: true
    },
    street_address: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    audition_plan_id: {
      type: mongoose.Types.ObjectId,
      ref: "Plan",
    },
    device_id: {
      type: String,
    },
    totp: {
      type: {
        type: String,
        enum: [
          "CREATE_ACCOUNT",
          "LOGIN",
          "RESET_PASSWORD",
          "CHANGE_EMAIL",
          "CHANGE_PHONE",
        ],
      },
      secret: {
        type: String,
      },
    },
    temp: [
      {
        type: {
          type: String,
          enum: ["CHANGE_EMAIL", "CHANGE_PHONE"],
        },
        value: {
          type: String,
        },
      },
    ],
    last_activity_at: {
      type: Date,
      default: Date.now,
    },
    reset_password: {
      token: {
        type: String,
        select: false,
      },
      expires_in: {
        type: Date,
        select: false,
      },
      reset_password_at: {
        type: Date,
        select: false,
      },
    },
    init_delete: {
      type: Boolean,
      default: false,
      required: true,
    },
    init_delete_at: {
      type: Date,
      select: false,
    },
    deletion_reason: {
      type: String,
      trim: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userModel.index({
  num: "text",
  status: "text",
  first_name: "text",
  last_name: "text",
  email: "text",
  phone: "text",
  type: "text",
  role: "text",
  is_archived: "text",
  is_deleted: "text",
});

module.exports = mongoose.model("User", userModel);
