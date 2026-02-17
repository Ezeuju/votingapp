const multer = require("multer");
const path = require("path");
const { AppError } = require("./error");

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for direct S3 upload

const fileFilter = (req, file, cb) => {
  // Add file type restrictions if needed
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|xlsx|xls|zip|rar/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new AppError(
        400,
        `File type not allowed. Allowed types: ${allowedTypes.source}`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only allow 1 file at a time
    fields: 10, // Max number of non-file fields
    fieldNameSize: 100, // Max field name size
    fieldSize: 1024 * 1024, // Max field value size (1MB)
  },
  fileFilter: fileFilter,
});

// Middleware wrapper to handle multer errors gracefully
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        // Log the error for debugging
        if (err instanceof multer.MulterError) {
          // Handle specific multer errors
          switch (err.code) {
            case "LIMIT_FILE_SIZE":
              return next(
                new AppError(400, "File too large. Maximum size is 10MB.")
              );
            case "LIMIT_FILE_COUNT":
              return next(
                new AppError(400, "Too many files. Only 1 file allowed.")
              );
            case "LIMIT_FIELD_COUNT":
              return next(new AppError(400, "Too many fields in the request."));
            case "LIMIT_UNEXPECTED_FILE":
              return next(
                new AppError(
                  400,
                  'Unexpected file field. Expected field name: "file"'
                )
              );
            default:
              return next(new AppError(400, `Upload error: ${err.message}`));
          }
        } else if (err instanceof AppError) {
          // Handle our custom errors (like file type validation)
          return next(err);
        } else {
          // Handle other errors
          return next(new AppError(500, "Upload processing failed"));
        }
      }
      next();
    });
  };
};

module.exports = {
  single: (fieldName = "file") => handleUpload(upload.single(fieldName)),
  multiple: (fieldName = "files", maxCount = 5) =>
    handleUpload(upload.array(fieldName, maxCount)),
  fields: (fields) => handleUpload(upload.fields(fields)),
  none: () => handleUpload(upload.none()),
  any: () => handleUpload(upload.any()),
};
