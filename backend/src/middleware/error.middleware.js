const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.error(err.message, { stack: err.stack });

  res.status(500).send("Internal server error");
};
