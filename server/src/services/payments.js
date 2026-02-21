const { paymentModel, planModel, userModel } = require("../models");
const validation = require("./validation/payment");
const paystackService = require("../thirdParty/paystack");
const { asyncLibWrapper } = require("../utils/wrappers");
const { AppError } = require("../middleware/error");
const randomstring = require("randomstring");
// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const logger = require("../logger");
const BaseService = require("./base");
const helpers = require("../utils/helpers");

class PaymentService extends BaseService {
  constructor() {
    super(paymentModel, validation);
  }
  // SHARED LOGIC: Process successful payment and create user
  _grantAccessToUser = async (reference) => {
    // Find payment record
    const payment = await paymentModel.findOne({ reference });
    if (!payment) throw new AppError(404, "Payment not found");

    // Create user account
    // const tempPassword = randomstring.generate(12);
    // const hashedPassword = await bcrypt.hash(
    //   tempPassword,
    //   parseInt(process.env.SALT_ROUND),
    // );

    const { metadata } = payment;

    const user = await userModel.create({
      first_name: metadata.first_name,
      last_name: metadata.last_name,
      email: metadata.email,
      country: metadata.country,
      street_address: metadata.street_address,
      town: metadata.town,
      state: metadata.state,
      audition_plan_id: metadata.audition_plan_id,
      account_type: "Applicant",
    });

    // update user record to pending while updating record from admin
    // const updated_user = await userModel.findByIdAndUpdate(
    //   payment.user_id,
    //   { account_status: "Pending" },
    //   { new: true },
    // );

    // Update payment record
    payment.user_id = user._id;
    payment.status = "success";
    await payment.save();

    // TODO: Send welcome email

    return user;
  };

  // SHARED LOGIC: Revoke access on refund/reversal
  _revokeAccessFromUser = async (reference) => {
    const payment = await this.model.findOne({ reference });
    if (!payment || !payment.user_id) return;

    // Deactivate user account
    await userModel.findByIdAndUpdate(payment.user_id, {
      status: false,
      account_status: "Pending",
    });

    // TODO: Send refund notification email

    logger.info(
      `Access revoked for user ${payment.user_id} due to refund/reversal`,
    );
  };

  initializePayment = asyncLibWrapper(async (params) => {
    const { error } = validation.initialize(params);
    if (error) throw new AppError(400, error.details[0].message);

    const { email, audition_plan_id, ...metadata } = params;

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (
      existingUser &&
      existingUser.account_status == "Confirmed" &&
      existingUser.audition_plan_id.toString() === audition_plan_id.toString()
    )
      throw new AppError(
        400,
        "This email is already registered for an audition with the selected plan, please select another plan.",
      );

    // Get plan details
    const plan = await planModel.findById(audition_plan_id);
    if (!plan) throw new AppError(404, "Invalid audition plan");

    // Generate unique reference
    const reference = `PAY_${Date.now()}_${randomstring.generate(10)}`;

    // // Create pending applicant user record
    // const user = await userModel.create({ ...metadata, audition_plan_id, email });

    // Create payment record
    const payment = await this.model.create({
      reference,
      amount: plan.amount,
      status: "pending",
      audition_plan_id,
      metadata: {
        ...metadata,
        email,
        audition_plan_id,
      },
    });

    // Initialize Paystack transaction
    const paystackResponse = await paystackService.initializeTransaction({
      email,
      amount: plan.amount,
      reference,
      metadata: {
        payment_id: payment._id.toString(),
        ...metadata,
      },
    });

    return {
      reference,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
    };
  });

  // VERIFY ENDPOINT: Triggered by frontend redirect
  verifyPayment = asyncLibWrapper(async (params) => {
    const { error } = validation.verify(params);
    if (error) throw new AppError(400, error.details[0].message);

    const { reference } = params;

    const payment = await this.model.findOne({ reference });
    if (!payment) {
      throw new AppError(404, "Payment reference not found in our records");
    }

    // check if webhook already processed the payment
    if (payment.status === "success") {
      return { status: "success", message: "Payment already verified" };
    }

    const paystackResponse = await paystackService.verifyTransaction(reference);
    const psData = paystackResponse.data;

    /// Handle Failed/Abandoned Payments
    if (psData.status !== "success") {
      payment.status = psData.status; // e.g., 'failed' or 'abandoned'
      payment.gateway_response = psData;
      await payment.save();

      return {
        status: psData.status,
        message: `Payment ${psData.status}: ${psData.gateway_response}`,
      };
    }

    payment.status = "success";
    payment.gateway_response = psData;
    payment.paid_at = psData.paid_at;
    await payment.save();

    // Grant access using shared logic
    await this._grantAccessToUser(reference);

    return {
      status: "success",
      message: "Payment verified and account created",
    };
  });

  // // WEBHOOK ENDPOINT: Triggered by Paystack servers
  // handleWebhook = asyncLibWrapper(async (payload, signature) => {
  //   // Verify webhook signature
  //   const hash = crypto
  //     .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
  //     .update(JSON.stringify(payload))
  //     .digest("hex");

  //   if (hash !== signature) {
  //     throw new AppError(401, "Invalid webhook signature");
  //   }

  //   const { event, data } = payload;

  //   if (event === "charge.success") {
  //     const reference = data.reference;

  //     // Update gateway response
  //     const payment = await paymentModel.findOne({ reference });
  //     if (payment) {
  //       payment.gateway_response = data;
  //       await payment.save();
  //     }

  //     // Grant access using shared logic
  //     await this._grantAccessToUser(reference);
  //   }

  //   return true;
  // });

  // WEBHOOK ENDPOINT: Triggered by Paystack servers
  handleWebhook = asyncLibWrapper(async (payload, signature) => {
    // 1. Verify webhook signature (Strictly necessary for security)
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== signature) {
      throw new AppError(401, "Invalid webhook signature");
    }

    const { event, data } = payload;
    const reference = data.reference;

    // 2. Locate the payment in your DB
    const payment = await this.model.findOne({ reference });
    if (!payment) {
      logger.error(`Webhook Error: Payment ref ${reference} not found.`);
      return true;
    }

    // 3. Handle Different Event Types
    switch (event) {
      case "charge.success":
        // Check if it was already marked success (by the Verify endpoint)
        if (payment.status !== "success") {
          payment.status = "success";
          payment.gateway_response = data;
          await payment.save();

          // Grant user access
          await this._grantAccessToUser(reference);
        }
        break;

      case "refund.processed":
      case "reversal.success":
        // Handle Refunds/Reversals
        payment.status = "reversed";
        payment.gateway_response = data;
        await payment.save();

        // revoke user access
        await this._revokeAccessFromUser(reference);
        break;

      default:
        // Log unhandled events like 'transfer.success' if you don't need them
        logger.error(`Unhandled Paystack event: ${event}`);
    }

    return true;
  });

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
      amount: 1,
      metadata: 1,
      status: 1,
      audition_plan: "$audition_plan.title",
    };
  }

  _getDefaultQuery() {
    return {
      is_archived: false,
    };
  }

  _getLookups() {
    return [
      {
        $lookup: {
          from: "plans",
          localField: "metadata.audition_plan_id",
          foreignField: "_id",
          as: "audition_plan",
        },
      },
      {
        $unwind: {
          path: "$audition_plan",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  _buildSearchStage(searchTerm) {
    const searchRegex = new RegExp(helpers.escapeRegex(searchTerm), "i");
    return {
      $match: {
        $or: [
          { "metadata.email": searchRegex },
          { "metadata.first_name": searchRegex },
          { "metadata.last_name": searchRegex },
          { "metadata.country": searchRegex },
          { audition_plan: searchRegex },
        ],
      },
    };
  }
}

module.exports = new PaymentService();
