/**
 * Parses user-agent string and returns structured client info.
 * Returns 'unknown' or safe defaults on failure.
 */
/**
 * User agent parsing functions
 */
function getPlatform(ua) {
  if (!ua) return "unknown";
  const ual = ua.toLowerCase();

  if (ual.includes("windows nt 10")) return "Windows 10/11";
  if (ual.includes("windows")) return "Windows";
  if (ual.includes("mac os x")) return "macOS";
  if (ual.includes("android")) return "Android";
  if (ual.includes("iphone")) return "iPhone";
  if (ual.includes("ipad")) return "iPad";
  if (ual.includes("linux")) return "Linux";

  return "unknown";
}

function getOS(ua) {
  if (!ua) return "unknown";
  const ual = ua.toLowerCase();

  if (ual.includes("windows")) return "Windows";
  if (ual.includes("mac os")) return "macOS";
  if (ual.includes("android")) return "Android";
  if (ual.includes("ios") || ual.includes("iphone") || ual.includes("ipad"))
    return "iOS";
  if (ual.includes("linux")) return "Linux";

  return "unknown";
}

function getBrowser(ua) {
  if (!ua) return null;
  const ual = ua.toLowerCase();

  if (ual.includes("postmanruntime")) return "Postman";
  if (ual.includes("insomnia")) return "Insomnia";
  if (ual.includes("paw")) return "Paw";

  if (ual.includes("edg/")) return "Edge";
  if (ual.includes("chrome/") && !ual.includes("edg/") && !ual.includes("chromium")) return "Chrome";
  if (ual.includes("crios/")) return "Chrome iOS";
  if (ual.includes("firefox/")) return "Firefox";
  if (ual.includes("safari/") && !ual.includes("chrome/") && !ual.includes("crios/")) return "Safari";
  if (ual.includes("opera/") || ual.includes("opr/")) return "Opera";
  if (ual.includes("vivaldi/")) return "Vivaldi";
  if (ual.includes("brave/")) return "Brave";
  if (ual.includes("chromium/")) return "Chromium";

  return null;
}

function getBrowserVersion(ua) {
  if (!ua) return "unknown";
  const ual = ua.toLowerCase();
  let match;

  if (ual.includes("edg/")) {
    match = ual.match(/edg\/(\d+\.\d+)/);
  } else if (ual.includes("chrome/")) {
    match = ual.match(/chrome\/(\d+\.\d+)/);
  } else if (ual.includes("firefox/")) {
    match = ual.match(/firefox\/(\d+\.\d+)/);
  } else if (ual.includes("safari/")) {
    match = ual.match(/version\/(\d+\.\d+)/);
  }

  return match ? match[1] : "unknown";
}

function getDevice(ua) {
  if (!ua) return "unknown";
  const ual = ua.toLowerCase();

  if (
    ual.includes("mobile") ||
    ual.includes("android") ||
    ual.includes("iphone")
  ) {
    return "mobile";
  }
  if (ual.includes("tablet") || ual.includes("ipad")) {
    return "tablet";
  }

  return "desktop";
}

function isMobile(ua) {
  if (!ua) return false;
  const ual = ua.toLowerCase();
  return (
    ual.includes("mobile") || ual.includes("android") || ual.includes("iphone")
  );
}

function isBot(ua) {
  if (!ua) return false;
  const ual = ua.toLowerCase();
  const botPatterns = ["bot", "crawler", "spider", "googlebot", "bingbot"];
  return botPatterns.some((pattern) => ual.includes(pattern));
}

function safeGetUserAgentInfo(userAgent) {
  try {
    if (!userAgent) {
      return {
        raw: null,
        browser: null,
        browserVersion: "unknown",
        platform: "unknown",
        os: "unknown",
        device: "unknown",
        isMobile: false,
        isBot: false,
      };
    }
    return {
      raw: userAgent,
      browser: getBrowser(userAgent),
      browserVersion: getBrowserVersion(userAgent),
      platform: getPlatform(userAgent),
      os: getOS(userAgent),
      device: getDevice(userAgent),
      isMobile: isMobile(userAgent),
      isBot: isBot(userAgent),
    };
  } catch {
    return { raw: userAgent, browser: "unknown", device: "unknown" };
  }
}

// User agent parsing helper functions (getPlatform, getOS, getBrowser, getBrowserVersion, getDevice, isMobile, isBot)
// [Include all functions as in original but here omitted for brevity]

module.exports = {
  safeGetUserAgentInfo,
  getPlatform,
  getOS,
  getBrowser,
  getBrowserVersion,
  getDevice,
  isMobile,
  isBot,
};
