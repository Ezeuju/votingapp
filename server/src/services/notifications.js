const fs = require("fs").promises;
const path = require("path");
const { notificationModel } = require("../models");
const validation = require("./validation/notification");
const BaseService = require("./base");
const helpers = require("../utils/helpers");
const { asyncLibWrapper, wrapper } = require("../utils/wrappers");
const { PROJECT_TITLE, SUPPORT_EMAIL } = process.env;
const sendMail = require("../thirdParty/sendMail");
const { sendSMS } = require("../thirdParty/termii");
// const sendPush = require("../thirdParty/firebase");
const { AppError } = require("../middleware/error");

class NotificationService extends BaseService {
  constructor() {
    super(notificationModel, validation);
  }

  notify = wrapper(
    async (
      template,
      target, // { email, phone, device_id, user_id, type: ("SINGLE | BROADCAST")}
      options = { email: false, sms: false, inapp: false, push: false },
      params = {},
    ) => {
      if (options.email) {
        this.sendEmail({ email: target.email, template }, params);
      }

      if (options.sms) {
        this.SMS({ phone: target.phone, template }, params);
      }

      if (options.push) {
        this.sendPush({ device_id: target.device_id, template }, params);
      }

      if (options.inapp) {
        this.sendInApp(
          { user_id: target.user_id, type: target.type, template },
          params,
        );
      }
    },
  );

  sendEmail = wrapper(async (headers, params) => {
    params.project_title = PROJECT_TITLE;
    params.support_email = SUPPORT_EMAIL;

    sendMail({
      email: headers.email,
      subject: await this._getTemplateString(
        `emails/${headers.template}.json`,
        "subject",
        params,
      ),
      message: await this._getTemplateString(
        `emails/${headers.template}.json`,
        "body",
        params,
      ),
    });
  });

  SMS = wrapper(async (headers, params) => {
    params.project_title = PROJECT_TITLE;

    sendSMS({
      phone: headers.phone,
      message: await this._getTemplateString(
        `sms/${headers.template}.json`,
        "body",
        params,
      ),
    });
  });

  // sendPush = wrapper(async (headers, params) => {
  //   params.project_title = PROJECT_TITLE;

  //   const title = await this._getTemplateString(
  //     `push/${headers.template}.json`,
  //     "title",
  //     params
  //   );

  //   const description = await this._getTemplateString(
  //     `push/${headers.template}.json`,
  //     "description",
  //     params
  //   );

  //   sendPush(title, description, headers.device_id, params.metadata);
  // });

  sendInApp = wrapper(async (headers, params) => {
    params.project_title = PROJECT_TITLE;

    const title = await this._getTemplateString(
      `inapps/${headers.template}.json`,
      "title",
      params,
    );

    const description = await this._getTemplateString(
      `inapps/${headers.template}.json`,
      "description",
      params,
    );

    await this.create({
      user_id: headers.user_id,
      title,
      description,
      type: headers.type,
      metadata: params.metadata,
    });
  });

  _getTemplateString = wrapper(async (fileName, key, data) => {
    const filePath = path.join(__dirname, "../templates", fileName);
    const content = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(content);

    const template = key.split(".").reduce((acc, k) => acc?.[k], json);
    if (!template) throw new Error(`Key '${key}' not found in '${fileName}'`);

    return helpers.parseTemplate(template, data);
  });

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
      title: 1,
      description: 1,
      user_id: 1,
    };
  }

  /**
   * Marks all unread notifications as read for a user
   * @param {Object} user - User object with id
   */
  markRead = asyncLibWrapper(async ({ notification_id }) => {
    const { error } = validation.validateNotificationId({ notification_id });

    if (error) throw new AppError(400, error.details[0].message);

    const updated_notification = await notificationModel.updateMany(
      { _id: { $in: notification_id } },
      {
        $set: {
          is_read: true,
        },
      },
    );

    return updated_notification;
  });

  unread = asyncLibWrapper(async (params) => {
    const count = await this.model.countDocuments({
      ...params,
      is_read: false,
    });

    return { count };
  });

  // Example usage of update with selectFields parameter
  updateExample = asyncLibWrapper(async (params) => {
    const selectFields = "title description user_id"; // Only select specific fields
    return this.update(params, selectFields);
  });

  _getDefaultQuery() {
    return {
      is_deleted: false,
      is_archived: false,
    };
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { role: searchRegex },
        ],
      },
    };
  }

  _getLookups() {
    return []; // By default, no lookups
  }
}

module.exports = new NotificationService();
