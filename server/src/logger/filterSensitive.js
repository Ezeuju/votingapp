const SENSITIVE_FIELDS = [
  "password",
  "creditCard",
  "pin",
  "otp",
  "token",
  "secret",
  "key",
  "auth",
  "authorization",
  "access_token",
  "refresh_token",
  "api_key",
  "private_key",
  "credit_card",
  "card_number",
  "cvv",
  "ssn",
  "social_security",
  "identity_number",
  "identification_number",
];

function filterSensitive(obj, visited = new WeakSet()) {
  if (obj !== null && typeof obj === "object") {
    if (visited.has(obj)) {
      // Circular reference detected; skip recursion to prevent infinite loop
      return "[Circular]";
    }
    visited.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((item) => filterSensitive(item, visited));
    }

    const newObj = {};
    for (const key in obj) {
      if (SENSITIVE_FIELDS.includes(key)) {
        newObj[key] = "[FILTERED]";
      } else {
        newObj[key] = filterSensitive(obj[key], visited);
      }
    }
    visited.delete(obj);
    return newObj;
  }
  return obj;
}

module.exports = { filterSensitive, SENSITIVE_FIELDS };
