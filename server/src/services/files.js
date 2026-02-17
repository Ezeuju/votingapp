const { AppError } = require("../middleware/error");
const s3Operations = require("../utils/s3Operations");
const { asyncLibWrapper } = require("../utils/wrappers");

// S3 configuration based on category
const s3Configs = {
  public: {
    region: "us-east-1",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_STORAGE_KEY_ID,
      secretAccessKey: process.env.S3_STORAGE_KEY_SECRET,
    },
    bucket: process.env.S3_STORAGE_BUCKET_NAME,
  },
  // Add more categories here
  private: {
    region: "us-east-1",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_PRIVATE_STORAGE_KEY_ID,
      secretAccessKey: process.env.S3_PRIVATE_STORAGE_KEY_SECRET,
    },
    bucket: process.env.S3_PRIVATE_STORAGE_BUCKET_NAME,
  },
  // e.g. "videos", "documents", etc.
};

const fileService = {
  create: asyncLibWrapper(async (file, user) => {
    const folder = user._id.toString();
    const storage = "public";

    if (!file) {
      throw new AppError(400, "No file provided.");
    }

    const config = s3Configs[storage];
    if (!config) {
      throw new AppError(400, `Invalid upload upload type: ${storage}`);
    }

    const s3 = s3Operations({
      region: config.region,
      endpoint: config.endpoint,
      credentials: config.credentials,
      Bucket: config.bucket,
    });

    const connectionTest = await s3.testConnection();
    if (!connectionTest) {
      throw new AppError(500, "S3 connection failed");
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedFilename = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");

    const normalizedFolder = folder?.replace(/\/+$/, "") || "uploads";
    const key = `${normalizedFolder}/${timestamp}-${randomString}-${sanitizedFilename}`;

    const uploadResult = await s3.uploadFile(file, key);
    if (!uploadResult) {
      throw new AppError(500, "File upload failed. Please try again.");
    }

    return uploadResult;
  }),
};

module.exports = fileService;
