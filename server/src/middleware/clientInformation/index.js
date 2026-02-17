const { defaultConfig } = require("./config");
const { safeGetIP, getIPVersion } = require("./ipUtils");
const { safeGetGeoLocation } = require("./geoLocation"); // This function moves here (see below)
const { safeGetUserAgentInfo } = require("./userAgent");
const { safeGetCloudflareInfo } = require("./cloudflare");
const { safeGetProxyInfo } = require("./proxy");
const { getMinimalClientInfo } = require("./fallback");
const { safeGet } = require("./cloudflare"); // For safeGetIPSources
const logger = require("../../logger");

/**
 * Main middleware or standalone function.
 */
const captureClientInfo = (
  req,
  res,
  next,
  options = { geoProvider: "geoip-lite" },
) => {
  const config = { ...defaultConfig, ...options };

  (async () => {
    try {
      const clientInfo = await extractClientInfo(req, config);
      req.clientInfo = clientInfo;

      if (next) next();
      else return clientInfo;
    } catch (error) {
      logger.error("[ClientInfo] Error capturing client info:", error.message);

      req.clientInfo = getMinimalClientInfo(req);
      if (next) next();
      else return req.clientInfo;
    }
  })();
};

/**
 * Extracts all client info.
 */
async function extractClientInfo(req, config) {
  const ip = safeGetIP(req);
  const userAgent = safeGet(() => req.headers["user-agent"], "");

  let location = null;
  if (config.geoProvider !== "none") {
    location = await safeGetGeoLocation(ip, config);
  }

  return {
    ipAddress: ip,
    ipVersion: getIPVersion(ip),
    ipSources: safeGetIPSources(req),
    ...(location ? location : {}),
    userAgent: safeGetUserAgentInfo(userAgent),
    cloudflare: safeGetCloudflareInfo(req),
    proxy: safeGetProxyInfo(req),
    timestamp: new Date().toISOString(),
    timestampUnix: Date.now(),
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].split(".")[0],
  };
}

/**
 * Get IP sources for logging/debugging
 */
function safeGetIPSources(req) {
  return safeGet(
    () => ({
      cloudflare: req.headers["cf-connecting-ip"] || null,
      cloudflarePseudo: req.headers["cf-pseudo-ipv4"] || null,
      trueClientIP: req.headers["true-client-ip"] || null,
      xForwardedFor: req.headers["x-forwarded-for"] || null,
      xRealIP: req.headers["x-real-ip"] || null,
      remoteAddress:
        req.connection?.remoteAddress || req.socket?.remoteAddress || null,
    }),
    {},
  );
}

function captureClientInfoMiddleware(options = {}) {
  return (req, res, next) => {
    // Assuming captureClientInfo is async and follows (req, res, next, options)
    captureClientInfo(req, res, next, options);
  };
}

module.exports = {
  captureClientInfo,
  extractClientInfo,
  captureClientInfoMiddleware,
};

/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * // OPTION 1: Use geoip-lite only (DEFAULT - local, fast, no limits)
 * const captureClientInfo = require('./clientInfo');
 * app.use(captureClientInfo);
 *
 * // OPTION 2: Use ip-api only (remote, has ISP data, 45 req/min)
 * app.use((req, res, next) => {
 *   captureClientInfo(req, res, next, { geoProvider: 'ip-api' });
 * });
 *
 * // OPTION 3: Use BOTH (hybrid - best of both worlds)
 * app.use((req, res, next) => {
 *   captureClientInfo(req, res, next, { geoProvider: 'both' });
 * });
 *
 * // OPTION 4: No geo lookup at all
 * app.use((req, res, next) => {
 *   captureClientInfo(req, res, next, { geoProvider: 'none' });
 * });
 *
 * // OPTION 5: Custom configuration
 * app.use((req, res, next) => {
 *   captureClientInfo(req, res, next, {
 *     geoProvider: 'ip-api',
 *     enableCache: true,
 *     cacheTTL: 7200000, // 2 hours
 *     ipApiTimeout: 3000, // 3 seconds
 *     fallbackOnError: true
 *   });
 * });
 *
 * // OPTION 6: Use as standalone function
 * const { extractClientInfo } = require('./clientInfo');
 *
 * app.get('/api/track', async (req, res) => {
 *   const clientInfo = await extractClientInfo(req, {
 *     geoProvider: 'both'
 *   });
 *   await db.save(clientInfo);
 *   res.json({ success: true });
 * });
 *
 * // Clear cache periodically
 * setInterval(() => {
 *   const { clearGeoCache } = require('./clientInfo');
 *   clearGeoCache();
 * }, 3600000); // Every hour
 * */
