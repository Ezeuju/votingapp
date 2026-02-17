/**
 * Extract proxy detection info from request headers safely.
 */
function safeGetProxyInfo(req) {
  return safeGet(
    () => ({
      detected: Boolean(
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.headers["cf-connecting-ip"] ||
        req.headers["via"] ||
        req.headers["forwarded"]
      ),
      forwardedFor: req.headers["x-forwarded-for"] || null,
      forwardedProto: req.headers["x-forwarded-proto"] || null,
      forwardedHost: req.headers["x-forwarded-host"] || null,
      via: req.headers["via"] || null,
    }),
    { detected: false }
  );
}

// Reuse safeGet from cloudflare.js or move safeGet to a utils/common.js file
const { safeGet } = require("./cloudflare");

module.exports = { safeGetProxyInfo };