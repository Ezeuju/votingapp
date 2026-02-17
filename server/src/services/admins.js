const { AppError } = require("../middleware/error");
const { adminModel } = require("../models");
const validation = require("./validation/admin");
const BaseService = require("./base");
const { asyncLibWrapper } = require("../utils/wrappers");
const helpers = require("../utils/helpers");
const trailService = require("./trails");
const { notify } = require("./notifications");

const bcrypt = require("bcrypt");
const salt_round = process.env.SALT_ROUND;
const ADMIN_LOGIN_URL = process.env.ADMIN_LOGIN_URL;

class AdminService extends BaseService {
  constructor() {
    super(adminModel, validation);
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
      account_status: 1,
      photo: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      role: 1,
    };
  }

  // Example usage of update with selectFields parameter
  updateExample = async (params) => {
    const selectFields = "title description user_id"; // Only select specific fields
    return this.update(params, selectFields);
  };

  create = asyncLibWrapper(async (params, currentUser = {}) => {
    const { error } = validation.create(params);

    if (error) throw new AppError(400, error.details[0].messages);

    // check if user already exists
    const existingUser = await this.adminExist(params.email);

    if (existingUser) {
      throw new AppError(409, "An account with this email already exists.");
    }

    const generatedPassword = this.generatePassword();

    // hash password
    const password = bcrypt.hashSync(generatedPassword, Number(salt_round));

    const create_team_data = {
      first_name: params.first_name,
      last_name: params.last_name,
      password: password,
      email: params.email,
      role: params.role,
    };

    const user = await this.model.create(create_team_data);

    if (!user) {
      throw new AppError(
        500,
        "Unable to create team member, please try again.",
      );
    }

    notify(
      "add_team_member",
      { email: user.email },
      { email: true },
      { ...create_team_data, generatedPassword, login_url: ADMIN_LOGIN_URL },
    );

    trailService.log({
      admin_id: currentUser._id,
      resource: this.resourceName,
      metadata: { ...create_team_data, password: "REDACTED" },
      action: "Create",
    });

    return user;
  });

  /**
   * Checks if user exists by various identifiers
   * @param {string} id - User identifier (ID, email, phone, username)
   * @param {string} [selectProperties] - Fields to select
   * @returns {Promise<Object|null>} User document or null
   */
  adminExist = asyncLibWrapper(async (id, selectProperties = null) => {
    if (!id) throw new Error("Invalid user identifier");

    const orConditions = helpers.buildIdentifierConditions(id);
    if (orConditions.length === 0) {
      throw new Error("No valid identifier format provided");
    }

    let query = adminModel.findOne({ $or: orConditions });
    if (selectProperties) query = query.select(selectProperties);
    return query;
  });

  generatePassword() {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*";

    const allChars = upperChars + lowerChars + digits + specialChars;
    const passwordLength = 12; // between 8 and 30 as per Joi rule

    // Ensure at least one of each type
    const passwordArray = [
      upperChars[Math.floor(Math.random() * upperChars.length)],
      lowerChars[Math.floor(Math.random() * lowerChars.length)],
      digits[Math.floor(Math.random() * digits.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    // Fill remaining characters randomly
    for (let i = passwordArray.length; i < passwordLength; i++) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the array to randomize order
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }

    return passwordArray.join("");
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex },
          { role: searchRegex },
        ],
      },
    };
  }

  _getDefaultQuery() {
    return {
      status: true,
    };
  }
}

module.exports = new AdminService();
