const pino = require("pino");
const OpenObserveStream = require("./openobserve-stream");

const ENV = process.env.NODE_ENV || "development";

let transport;
if (ENV === "development") {
  // Console only in dev
  transport = pino.transport({
    target: require.resolve("pino-pretty"),
    options: { colorize: true },
  });
} else {
  // Staging/production: OpenObserve only
  transport = new OpenObserveStream();
}

const logger = pino(
  {
    level: "debug",
    redact: ["password", "creditCard", "ssn"],
    safe: true,
  },
  transport
);

module.exports = logger;
