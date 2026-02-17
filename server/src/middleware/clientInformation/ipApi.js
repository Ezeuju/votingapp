const fetch = require("node-fetch");
const { geoCache } = require("./config");
const logger = require("../../logger");

/**
 * Fetch geo info from ip-api.com with caching and timeout.
 * Returns additional ISP & network info.
 */
async function getGeoFromIpApi(ip, config) {
  try {
    if (config.enableCache) {
      const cached = geoCache.get(ip);
      if (cached && Date.now() - cached.timestamp < config.cacheTTL) {
        return { ...cached.data, cached: true };
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.ipApiTimeout);

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=${config.ipApiFields}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ip-api responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "fail") {
      logger.error("[ClientInfo] ip-api error:", data.message);
      return null;
    }

    const result = {
      //provider: "ip-api",
      country: data.country || null,
      //countryCode: data.countryCode || null,
      //region: data.regionName || data.region || null,
      //regionCode: data.region || null,
      city: data.city || null,
      //zipCode: data.zip || null,
      //timezone: data.timezone || null,
      //latitude: data.lat || null,
      //longitude: data.lon || null,
      //coordinates: data.lat && data.lon ? `${data.lat},${data.lon}` : null,
      isp: data.isp || null,
      organization: data.org || null,
      asn: data.as || null,
      mobile: data.mobile || false,
      proxy: data.proxy || false,
      hosting: data.hosting || false,
      cached: false,
    };

    if (config.enableCache) {
      geoCache.set(ip, { data: result, timestamp: Date.now() });
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      logger.error("[ClientInfo] ip-api timeout");
    } else {
      logger.error("[ClientInfo] ip-api error:", error.message);
    }
    return null;
  }
}

module.exports = { getGeoFromIpApi };
