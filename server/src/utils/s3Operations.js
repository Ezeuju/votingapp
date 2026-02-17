const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logger = require("../logger");

function s3Operations(config) {
  // Configure S3Client with checksum disabled
  const s3Client = new S3Client({
    ...config,
    // Disable checksums for compatibility with non-AWS S3 services
    checksumMode: "DISABLED",
    // Force path-style URLs for better compatibility
    forcePathStyle: true,
    // Disable automatic checksum generation
    useAccelerateEndpoint: false,
    endpoint: config.endpoint,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    signatureVersion: "v4",
    s3ForcePathStyle: true,
  });

  return {
    testConnection: async () => {
      try {
        const testKey = `test-write-access-${Date.now()}.txt`;
        // Test read access
        await s3Client.send(
          new ListObjectsCommand({
            Bucket: config.Bucket,
            MaxKeys: 1,
          })
        );

        // Test write access with explicit checksum disabled
        await s3Client.send(
          new PutObjectCommand({
            Bucket: config.Bucket,
            Key: testKey,
            Body: "This is a test file to verify write access.",
          })
        );

        // Clean up the test file
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: config.Bucket,
            Key: testKey,
          })
        );
        return true;
      } catch (error) {
        logger.error("S3 connection test failed:", error);
        return false;
      }
    },

    uploadFile: async (file, key) => {
      // Sanitize key by replacing spaces with underscores
      const sanitizedKey = key.replace(/\s+/g, "_");

      // Extract file extension and base name
      const extensionIndex = sanitizedKey.lastIndexOf(".");
      const extension =
        extensionIndex !== -1 ? sanitizedKey.substring(extensionIndex) : "";
      const baseName =
        extensionIndex !== -1
          ? sanitizedKey.substring(0, extensionIndex)
          : sanitizedKey;

      // Add unique prefix and suffix using timestamp and UUID
      const uniqueKey = `upload_${baseName}_${Date.now()}_${uuidv4()}${extension}`;

      const params = {
        Bucket: config.Bucket,
        Key: uniqueKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${file.originalname}"`,
        Metadata: {
          "original-name": file.originalname,
          "upload-time": new Date().toISOString(),
        },
      };

      try {
        await s3Client.send(new PutObjectCommand(params));
        logger.info("File uploaded successfully:", uniqueKey);
        return {
          url: `https://${config.Bucket}.${config.endpoint.replace(
            /^https:\/\//,
            ""
          )}/${encodeURIComponent(uniqueKey)}`,
          size: (file.size / (1024 * 1024)).toFixed(2),
          scale: "MB",
          type: file.mimetype,
        };
      } catch (error) {
        logger.error("S3 upload error:", error);
        return false;
      }
    },

    // Delete file
    deleteFile: async (key) => {
      const params = {
        Bucket: config.Bucket,
        Key: key,
      };

      try {
        const result = await s3Client.send(new DeleteObjectCommand(params));
        logger.info("File deleted successfully:", key);
        return result;
      } catch (error) {
        logger.error("S3 delete error:", error);
        throw error;
      }
    },

    // Generate download URL
    getDownloadUrl: async (key, expirationSeconds = 900) => {
      const params = {
        Bucket: config.Bucket,
        Key: key,
      };

      try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: expirationSeconds,
          // Disable checksums in signed URLs too
          signatureVersion: "v4",
        });
        logger.info(
          `Download URL generated successfully for ${key}. Expires in ${expirationSeconds} seconds.`
        );
        return url;
      } catch (error) {
        logger.error("S3 signed URL error:", error);
        throw error;
      }
    },
  };
}

module.exports = s3Operations;
