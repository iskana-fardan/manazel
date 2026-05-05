const logger = require("../startup/logging");
const AppError = require("../errors/AppError");
const { failure } = require("../utils/response");

module.exports = function errorHandler(err, req, res, _next) {
  const log = req.log || logger;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    log.warn("CastError", { path: err.path, value: err.value });
    return res.status(400).json(failure("Invalid ID"));
  }

  // Mongoose schema validation
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    log.warn("MongooseValidationError", { message });
    return res.status(400).json(failure(message));
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    log.warn("DuplicateKeyError", { field });
    return res.status(400).json(failure(`Duplicate value for ${field}`));
  }

  // Operational AppError (thrown intentionally)
  if (err instanceof AppError) {
    log.warn(err.message, { statusCode: err.statusCode });
    return res.status(err.statusCode).json(failure(err.message));
  }

  // Unexpected error
  log.error(err.message, { stack: err.stack });
  res.status(500).json(failure("Internal server error"));
};
