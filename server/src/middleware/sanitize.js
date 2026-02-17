const xss = require('xss');

function isObject(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function sanitize(input) {
  if (Array.isArray(input)) {
    return input.map(sanitize);
  } else if (isObject(input)) {
    const clean = {};
    for (const key in input) {
      if (
        key.startsWith('$') || 
        key.includes('.') || 
        !Object.hasOwn(input, key)
      ) {
        continue; // Skip dangerous or inherited keys
      }
      clean[key] = sanitize(input[key]); // Recursively sanitize values
    }
    return clean;
  } else if (typeof input === 'string') {
    return xss(input); // Sanitize potential XSS strings
  }
  return input; // Return safe primitives
}

function sanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitize({ ...req.body });
  if (req.params) req.params = sanitize({ ...req.params });
  if (req.query) req.sanitizedQuery = sanitize({ ...req.query }); // Don't overwrite req.query
  next();
}

module.exports = sanitizeMiddleware;
