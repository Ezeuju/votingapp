// Helper to format date
const formatDate = (date) => {
  const lagosDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Africa/Lagos" }),
  );
  const pad = (n) => String(n).padStart(2, "0");
  return `${lagosDate.getFullYear()}-${pad(lagosDate.getMonth() + 1)}-${pad(
    lagosDate.getDate(),
  )}T${pad(lagosDate.getHours())}:${pad(lagosDate.getMinutes())}:${pad(
    lagosDate.getSeconds(),
  )}+01:00`;
};

// JSON adjustment logic
const adjustJSON = (data, dateFields) => {
  const seen = new WeakSet();

  function adjust(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (seen.has(obj)) return obj;
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(adjust);
    }

    for (const key in obj) {
      const val = obj[key];

      if (val instanceof Date && dateFields.includes(key)) {
        obj[key] = formatDate(val);
      } else if (val && typeof val === "object") {
        obj[key] = adjust(val);
      }
    }

    return obj;
  }

  return adjust(data);
};

// CSV adjustment logic
const adjustCSV = (csvString, dateFields) => {
  const lines = csvString.split("\n");
  if (lines.length === 0) return csvString;

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  const dateFieldIndices = headers
    .map((header, index) => (dateFields.includes(header) ? index : -1))
    .filter((index) => index !== -1);

  if (dateFieldIndices.length === 0) return csvString;

  const adjustedLines = lines.map((line, lineIndex) => {
    if (lineIndex === 0) return line; // Keep header unchanged

    const values = line.split(",");
    dateFieldIndices.forEach((index) => {
      if (values[index]) {
        const cleanValue = values[index].trim().replace(/^"|"$/g, "");
        const date = new Date(cleanValue);

        if (!isNaN(date.getTime())) {
          const formatted = formatDate(date);
          values[index] = values[index].includes('"')
            ? `"${formatted}"`
            : formatted;
        }
      }
    });

    return values.join(",");
  });

  return adjustedLines.join("\n");
};

const adjustDate = (req, res, next) => {
  const original_json = res.json;
  const original_send = res.send;

  const dateFields = [
    "createdAt",
    "updatedAt",
    "date",
    "Date",
    "created_at",
    "last_run_at",
    "next_run_at",
  ];

  // Override res.json
  res.json = function (data) {
    const adjusted = adjustJSON(data, dateFields);
    return original_json.call(this, adjusted);
  };

  // Override res.send
  res.send = function (data) {
    const contentType = res.get("Content-Type") || "";

    if (contentType.includes("text/csv") && typeof data === "string") {
      const adjusted = adjustCSV(data, dateFields);
      return original_send.call(this, adjusted);
    }

    return original_send.call(this, data);
  };

  next();
};

module.exports = { gateway: () => adjustDate };
