const nodemailer = require("nodemailer");
const logger = require("../logger");
const smtp_sender_name = process.env.SMTP_SENDER_NAME;
const smtp_from = process.env.SMTP_FROM;
const smtp_host = process.env.SMTP_HOST;
const smtp_port = process.env.SMTP_PORT;
const smtp_username = process.env.SMTP_USERNAME;
const smtp_password = process.env.SMTP_PASSWORD;
const smtp_secure = process.env.SMTP_SECURE;

let sendMail;

sendMail = sendMail = async (options) => {
  try {
    // create transporter
    const transport = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_secure === "true",
      auth: {
        user: smtp_username,
        pass: smtp_password,
      },
    });

    const mailOptions = {
      from: `${smtp_sender_name} ${smtp_from}`,
      to: options.email,
      subject: options.subject,
      html: options.message,
      attachments: options.attachments
        ? [
            {
              filename: options.attachments[0].filename,
              content: options.attachments[0].file,
              encoding: "base64",
            },
          ]
        : [],
      cc: options.cc ? options.cc.map((recipient) => recipient.email) : [],
    };

    // send mail
    await transport.sendMail(mailOptions);
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
  }
};

module.exports = sendMail;
