const speakeasy = require("speakeasy");
const logger = require("../logger");
const environment = process.env.NODE_ENV;

const TOTP = {
  async generate(digits) {
    try {
      if (!Number.isInteger(digits) || digits <= 0) {
        throw new Error("Digits must be a positive integer.");
      }
      const secret = speakeasy.generateSecret({ length: 20 }).base32;

      const token = speakeasy.totp({
        secret,
        encoding: "base32",
        digits,
        step: 600, // 10 minutes
      });
      if (environment == "development") {
        logger.info(
          `Generated OTP: ${token} with secret: ${secret} for environment: ${environment}`,
        );
      }

      return { secret, token };
    } catch (error) {
      logger.error("Error generating OTP:", error);
      return false;
    }
  },

  async verify(userInput, token_secret) {
    try {
      const token_delta = speakeasy.totp.verify({
        secret: token_secret,
        encoding: "base32",
        token: userInput.trim(),
        step: 600,
        window: 1,
      });

      if (environment == "development" || environment == "staging") {
        if (userInput == "123456") {
          return true;
        }
        logger.info(
          `OTP verification result: ${token_delta} for token: ${userInput} with secret: ${token_secret}`,
        );
      }
      return token_delta;
    } catch (error) {
      logger.error("Error verifying OTP:", error);
      return false;
    }
  },
};

module.exports = TOTP;
