const axios = require("axios");

const { AppError } = require("../middleware/error");
const reCAPTCHA_secret_key = process.env.CLOUDFLARE_SECRET_KEY;
const reCAPTCHA_verify_api = process.env.CLOUDFLARE_VERIFY_API;

const verifyCAPTCHA = async (recaptcha_token) => {
  const options = {
    method: "POST",
    url: reCAPTCHA_verify_api,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      secret: reCAPTCHA_secret_key,
      response: recaptcha_token,
    },
  };

  return axios(options)
    .then((data) => {
      if (data.data.success) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      if (error?.response?.data) {
        if (!error.response.data.success) return false;
      }
      throw new AppError(500, "Internal server error.");
    });
};

module.exports = verifyCAPTCHA;
