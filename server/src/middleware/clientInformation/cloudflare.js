/**
 * Extract Cloudflare-specific headers safely.
 */
function safeGetCloudflareInfo(req) {
  return safeGet(
    () => ({
      enabled: Boolean(req.headers["cf-ray"]),
      ray: req.headers["cf-ray"] || null,
      visitor: req.headers["cf-visitor"] || null,
      country: req.headers["cf-ipcountry"] || null,
      connectingIP: req.headers["cf-connecting-ip"] || null,
    }),
    { enabled: false }
  );
}

/**
 * Generic safe getter function shared across modules
 */
function safeGet(fn, defaultValue = null) {
  try {
    const result = fn();
    return result === null ? defaultValue : result;
  } catch {
    return defaultValue;
  }
}

module.exports = { safeGetCloudflareInfo, safeGet };