const logger = require("./index");
const { filterSensitive } = require("./filterSensitive");
const crypto = require("crypto");

const SENSITIVE_HEADERS = ["authorization", "device_token", "cookie", "device-token"];

function filterSensitiveHeaders(headers) {
  const sanitized = {};
  for (const key in headers) {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      sanitized[key.toLowerCase()] = "[FILTERED]";
    } else {
      sanitized[key.toLowerCase()] = headers[key];
    }
  }
  return sanitized;
}

function requestLogger(serviceName = "nodejs-service") {
  return (req, res, next) => {
    const start = Date.now();
    const trace_id = crypto.randomBytes(16).toString("hex");
    const span_id = crypto.randomBytes(8).toString("hex");

    const originalSend = res.send;
    let responseBody;

    res.send = function (body) {
      responseBody = body;
      return originalSend.apply(res, arguments);
    };

    res.on("finish", () => {
      const duration_ms = Date.now() - start;

      // Parse response body if JSON
      let parsedBody = responseBody;
      if (typeof responseBody === "string") {
        try {
          parsedBody = JSON.parse(responseBody);
        } catch {}
      }

      const log = {
        timestamp: new Date().toISOString(),
        service: { name: serviceName },
        environment: process.env.NODE_ENV || "development",
        trace_id,
        span_id,
        http: {
          method: req.method,
          route: req.route?.path || req.originalUrl,
          status_code: res.statusCode,
        },
        user: req.user ? { id: req.user.id } : undefined,
        request: {
          headers: filterSensitiveHeaders(req.headers),
          body: filterSensitive(req.body),
          url: req.originalUrl,
        },
        response: {
          body: filterSensitive(parsedBody),
        },
        duration_ms,
        level: "info",
      };

      logger.info(log);
    });

    next();
  };
}

module.exports = requestLogger;
