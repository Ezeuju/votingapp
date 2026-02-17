/**
 * Extract and validate IP address from request headers.
 */
function safeGetIP(req) {
  try {
    const ipHeaders = [
      "cf-connecting-ip", "true-client-ip", "x-real-ip", "x-forwarded-for",
      "x-client-ip", "x-cluster-client-ip", "fastly-client-ip",
      "forwarded-for", "x-forwarded", "appengine-user-ip", "cf-pseudo-ipv4",
    ];
    for (const header of ipHeaders) {
      const value = req.headers?.[header];
      if (value) {
        const ip = value.split(",")[0].trim();
        if (isValidIP(ip)) return ip;
      }
    }
    return req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Validates IPv4/IPv6 format.
 */
function isValidIP(ip) {
  if (!ip || typeof ip !== "string") return false;
  ip = ip.replace(/^::ffff:/, "");
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Determines IP version based on format.
 */
function getIPVersion(ip) {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) return "IPv6";
  if (ip.includes(".")) return "IPv4";
  return "unknown";
}

module.exports = { safeGetIP, isValidIP, getIPVersion };