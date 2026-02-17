const { Writable } = require("stream");
const axios = require("axios");
const { filterSensitive } = require("./filterSensitive");

const OO_AUTH = process.env.OPENOBSERVE_AUTH; // base64 user:pass
const OO_ORG = process.env.OPENOBSERVE_ORG || "default";
const OO_STREAM = process.env.OPENOBSERVE_STREAM || "nodejs";
const environment = process.env.NODE_ENV;

class OpenObserveStream extends Writable {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
  }

  _write(chunk, encoding, callback) {
    try {
      let log;
      if (typeof chunk === "string") {
        try {
          log = JSON.parse(chunk); // <-- parse back to object
        } catch {
          log = { message: chunk }; // fallback if not JSON
        }
      } else if (Buffer.isBuffer(chunk)) {
        try {
          log = JSON.parse(chunk.toString());
        } catch {
          log = { message: chunk.toString() };
        }
      } else {
        log = chunk; // already object
      }

      const sanitized = filterSensitive(log);
      axios
        .post(
          `https://observe.sgs.ng/api/${OO_ORG}/${OO_STREAM}-${environment}/_json`,
          [sanitized],
          {
            headers: {
              Authorization: `Basic ${OO_AUTH}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.error("Failed to send log to OpenObserve:", err.message);
        })
        .finally(() => callback());
    } catch (err) {
      console.error("Logger internal error:", err.message);
      callback();
    }
  }
}

module.exports = OpenObserveStream;
