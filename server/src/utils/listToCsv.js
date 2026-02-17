const Json2csvParser = require("json2csv").Parser;

const { AppError } = require("../middleware/error");

const csv = {
  async listToCsv(params, Model, pipeline) {
    const data = await Model.aggregate([...pipeline]);

    if (!params.columns) {
      throw new AppError(
        400,
        "Please Enter 'columns' Key and Its Value As A Query Parameter e.g. columns=route,driver,status..."
      );
    }

    const columnsQuery = params.columns.split(",").map((col) => col.trim());

    // Helper to flatten objects using dot notation
    const flattenObject = (obj, prefix = "") => {
      /* eslint-disable prefer-const */
      let result = {};
      /* eslint-disable prefer-const */

      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          Object.assign(result, flattenObject(value, newKey));
        } else {
          result[newKey] = value;
        }
      }
      return result;
    };

    // Flatten each document
    const flattenedData = data.map((item) => flattenObject(item));

    // Expand object columns but remove the parent prefix
    const expandedColumns = new Set();

    for (const col of columnsQuery) {
      for (const record of flattenedData) {
        // Direct field
        if (Object.keys(record).includes(col)) {
          expandedColumns.add(col);
          break;
        }

        // Nested fields (e.g., route.*)
        const subKeys = Object.keys(record).filter((key) =>
          key.startsWith(`${col}.`)
        );
        if (subKeys.length > 0) {
          // Remove prefix (e.g., "route.") so that only nested keys appear
          subKeys.forEach((k) => expandedColumns.add(k.replace(`${col}.`, "")));
          break;
        }
      }
    }

    const columns = Array.from(expandedColumns);

    // Build fields for CSV
    const capitalize_each_word = (label) => {
      const header = label.split(".").join(" ").split("_");
      return header
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    const fields = columns.map((col) => ({
      label: capitalize_each_word(col),
      value: col,
    }));

    // Map data to new objects without parent prefixes
    const processedData = flattenedData.map((item) => {
      const newItem = {};
      for (const col of columns) {
        // Look for both prefixed and unprefixed versions
        const foundKey = Object.keys(item).find(
          (key) => key.endsWith(`.${col}`) || key === col
        );
        if (foundKey) newItem[col] = item[foundKey];
      }
      return newItem;
    });

    const json2csvParser = new Json2csvParser({ fields });
    const csvData = json2csvParser.parse(processedData);

    return csvData;
  },
};

module.exports = csv;
