const defaultConfig = {
  geoProvider: "geoip-lite",
  enableCache: true,
  cacheTTL: 3600000,
  ipApiTimeout: 5000,
  ipApiFields:
    "status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting",
  fallbackOnError: true,
};
// In-memory cache for ip-api results
const geoCache = new Map();

module.exports = { defaultConfig, geoCache };