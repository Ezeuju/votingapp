const { getGeoFromGeoipLite } = require("./geoipLite");
const { getGeoFromIpApi } = require("./ipApi");
const logger = require("../../logger");

/**
 * Fetch geographic location according to configured provider.
 * Handles fallback and provider combinations.
 */
async function safeGetGeoLocation(ip, config) {
  try {
    if (
      !ip ||
      ip === "unknown" ||
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("::ffff:127.")
    ) {
      return null; // Skip localhost and unknown IPs
    }

    const provider = config.geoProvider;

    if (provider === "geoip-lite") {
      return getGeoFromGeoipLite(ip);
    }

    if (provider === "ip-api") {
      const result = await getGeoFromIpApi(ip, config);
      if (!result && config.fallbackOnError) {
        return getGeoFromGeoipLite(ip);
      }
      return result;
    }

    if (provider === "both") {
      const [geoipData, ipApiData] = await Promise.allSettled([
        Promise.resolve(getGeoFromGeoipLite(ip)),
        getGeoFromIpApi(ip, config),
      ]);

      const geoip = geoipData.status === "fulfilled" ? geoipData.value : null;
      const ipapi = ipApiData.status === "fulfilled" ? ipApiData.value : null;

      if (ipapi) {
        return {
          ...geoip,
          ...ipapi,
          source: "both",
          //geoipLite: geoip,
          //ipApi: ipapi,
        };
      }
      return geoip;
    }

    return null;
  } catch (error) {
    logger.error("[ClientInfo] Geo location error:", error.message);
    return config.fallbackOnError ? getGeoFromGeoipLite(ip) : null;
  }
}

module.exports = { safeGetGeoLocation };
