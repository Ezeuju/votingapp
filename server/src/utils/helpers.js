/**
 * Utility functions for common application tasks
 * @module utils/helpers
 */

const helpers = {
  /**
   * Creates a standardized response handler for API endpoints
   * @param {number} status_code - HTTP status code
   * @param {string} message - Response message
   * @param {*} [data] - Optional response data
   * @returns {Function} Response handler function (req, res) => void
   * @example
   * router.get('/', (req, res) => {
   *   sendResponse(200, 'Success', data)(req, res);
   * });
   */
  sendResponse(statusCode, message, data) {
    return (req, res) => {
      if (res.headersSent) return;

      const response = {
        status: statusCode,
        message,
        ...(data && { data }), // Only include data if truthy
      };

      res.status(statusCode).json(response);
    };
  },

  /**
   * Normalizes phone numbers to international format with country code
   * @param {string} input - Raw phone number input
   * @returns {string|null} Formatted phone number or null for invalid input
   * @throws {Error} If phone number validation fails
   */
  formatPhoneNumber(input) {
    if (typeof input !== "string") return input;

    // Remove all non-digit characters except leading '+'
    const cleaned = input
      .trim()
      .toLowerCase()
      .replace(/[^\d+]/g, "");

    // If input doesn't contain enough digits to be a phone number, return it
    const digitsOnly = cleaned.replace(/\D/g, "");
    if (digitsOnly.length < 7) return input; // Too short to be a phone number

    // If it's already in international format (starts with '+'), return as is
    if (cleaned.startsWith("+")) {
      return cleaned;
    }

    // Handle Nigerian local format (starts with '0')
    if (cleaned.startsWith("0")) {
      return "+234" + cleaned.substring(1);
    }

    // If starts with '234' without '+', add it
    if (cleaned.startsWith("234")) {
      return "+" + cleaned;
    }

    // For all other cases, return as-is — don't assume it's Nigerian
    return input;
  },

  buildPaginationStages(pageNo = 1, limitNo = 10) {
    const page = Number(pageNo);
    const limit = Number(limitNo);

    return [
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                page,
                limit,
                pages: { $ceil: { $divide: ["$total", limit] } },
              },
            },
          ],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
      {
        $addFields: {
          metadata: { $arrayElemAt: ["$metadata", 0] },
        },
      },
    ];
  },

  buildDateRangeQuery(from, to) {
    if (!from || !to) return null;
    return {
      $gte: new Date(from),
      $lte: new Date(new Date(to).getTime() + 86399999),
    };
  },

  getSortOptions(filter = "createdAt", order = -1) {
    return {
      $sort: {
        [filter]: parseInt(order, 10),
      },
    };
  },

  buildStatusQuery(status) {
    if (status === "active") return { status: true };
    if (status === "suspended") return { status: false };
    return {};
  },

  buildIdentifierConditions(id) {
    const mongoose = require("mongoose");
    const conditions = [];
    let key = "unknown";

    if (mongoose.Types.ObjectId.isValid(id)) {
      key = "objectId";
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
      key = "email";
    } else if (/^\+?\d{10,15}$/.test(id)) {
      key = "phone";
    } else if (typeof id === "string" && id.length >= 3) {
      key = "username";
    }

    switch (key) {
      case "objectId":
        conditions.push({ _id: id });
        break;
      case "email":
        conditions.push({ email: id });
        break;
      case "phone":
        id = helpers.formatPhoneNumber(id.trim());
        conditions.push({ phone: id });
        break;
      case "username":
        conditions.push({
          username: new RegExp(`^${helpers.escapeRegex(id)}$`, "i"),
        });
        break;
      default:
        break;
    }

    return conditions;
  },

  parseTemplate(template, data) {
    return template.replace(/\{\{\s*([\w-]+)\s*}}/g, (_, key) =>
      Object.hasOwn(data, key) ? data[key] : `{{${key}}}`,
    );
  },

  escapeRegex(string) {
    // Handle null, undefined, or non-string inputs
    if (!string || typeof string !== "string") {
      return "";
    }

    // Escape special regex characters: ^$.*+?()[]{}|\
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  checkEmailOrPhone(input) {
    // Regular expression for validating an email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Regular expression for validating a phone number
    // This pattern matches phone numbers with optional spaces, dashes, parentheses, and country codes
    const phonePattern = /^\+?(\d[\d\-\(\)\s]{7,}\d)$/;

    if (emailPattern.test(input)) {
      return "email";
    } else if (phonePattern.test(input)) {
      return "phone";
    } else {
      return "invalid input";
    }
  },

  buildNotifyTargetAndOptions(identifier, channel) {
    if (channel === "email") {
      return {
        target: { email: identifier },
        options: { email: true },
      };
    }

    if (channel === "phone") {
      return {
        target: { phone: identifier },
        options: { sms: true },
      };
    }

    return {
      target: {},
      options: {},
    };
  },

  /**
   * Generates a globally unique referral code using email, timestamp, and randomness.
   * @param {String} email - User's email (used for uniqueness).
   * @param {Number} length - Length of the referral code (default: 10).
   * @returns {String} Referral code.
   */
  generateReferralCode(email, length = 10) {
    const crypto = require("crypto");
    if (typeof email !== "string" || !email) {
      throw new Error("Email is required to generate referral code.");
    }

    const emailHash = crypto
      .createHash("sha1")
      .update(email)
      .digest("hex")
      .toUpperCase(); // 40 chars
    const timestampPart = Date.now().toString(36).toUpperCase(); // e.g., "L54R7BW"
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars

    const raw = `${emailHash}${timestampPart}${randomPart}`;

    // Trim or pad to exact length
    return raw.substring(0, length);
  },

  capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

module.exports = helpers;
