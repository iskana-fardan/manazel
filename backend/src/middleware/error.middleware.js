const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.error(err.message, { stack: err.stack });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  // Mongoose schema validation failure
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `Duplicate value for ${field}` });
  }

  // Propagate an explicit status set by the thrower
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({ message: err.message });
  }

  res.status(500).send("Internal server error");
};
