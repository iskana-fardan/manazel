const { randomUUID } = require("crypto");
const logger = require("../startup/logging");

module.exports = function requestId(req, _res, next) {
  req.id = randomUUID();
  req.log = logger.child({ requestId: req.id });
  next();
};
