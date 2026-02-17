const geoip = require("geoip-lite");
const countries = require("i18n-iso-countries");
const logger = require("../../logger");

/**
 * Returns geo info using geoip-lite local database.
 * GeoIP database has no limits but no ISP info.
 */
function getGeoFromGeoipLite(ip) {
  try {
    const geo = geoip.lookup(ip);
    if (!geo) return null;

    return {
      //provider: "geoip-lite",

      countryCode: geo.country,
      country: countries.getName(geo.country, "en") || null,
      region: geo.region,
      timezone: geo.timezone,
      latitude: geo.ll?.[0] ?? null,
      longitude: geo.ll?.[1] ?? null,
      points: geo.ll ? `${geo.ll[0]},${geo.ll[1]}` : null,
    };
  } catch (error) {
    logger.error("[ClientInfo] geoip-lite error:", error.message);
    return null;
  }
}

module.exports = { getGeoFromGeoipLite };
