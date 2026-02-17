require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const routes = require("./src/routes");
const bodyParser = require("body-parser");
const compression = require("compression");
const environment = process.env.NODE_ENV;
const project_title = process.env.PROJECT_TITLE;
const cors = require("cors");
const { handleError } = require("./src/middleware/error");
const { gateway } = require("./src/middleware/gateway");
// const { isRateLimited } = require("./src/middleware/auth");
const sanitize = require("./src/middleware/sanitize");
const requestLogger = require("./src/logger/requestLogger");

// disable console methods globally
/* eslint-disable no-empty-function */
/* eslint-disable no-console */
// console.log = function () {};
console.info = function () {};
console.warn = function () {};
// console.error = function () {};
/* eslint-disable no-console */
/* eslint-enable no-empty-function */

const app = express();

app.use(bodyParser.json());

// returns the real client's IP
// even if client is behind a proxy
app.set("trust proxy", true);

// data sanitization against query injection
app.use(sanitize);

// compress all payload size
app.use(compression());

// logging
app.use(
  requestLogger(`${project_title}-backend`, {
    version: "1.0.0",
    maxBodyLength: 1000,
    logRequestBody: true,
    logResponseBody: environment !== "production", // Don't log response bodies in production
  }),
);

const whitelist = [
  // add your allowed URLs here excluding localhost
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(gateway());

// routes
// app.use("/api", isRateLimited, routes);
app.use("/api", routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = app;
