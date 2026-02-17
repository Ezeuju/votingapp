/**
 * Minimal fallback info for graceful degradation.
 */
function getMinimalClientInfo(req) {
  return {
    ipAddress: (req.ip || req.connection?.remoteAddress) ?? "unknown",
    timestamp: new Date().toISOString(),
    error: "Partial data due to extraction error",
  };
}

module.exports = { getMinimalClientInfo };