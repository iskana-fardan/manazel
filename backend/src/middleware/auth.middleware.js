const jwt = require("jsonwebtoken");
const config = require("../config");
const AppError = require("../errors/AppError");

module.exports = function auth(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next(new AppError("Unauthorized", 401));

  try {
    req.admin = jwt.verify(token, config.jwt.secret);
    next();
  } catch {
    next(new AppError("Invalid token", 401));
  }
};
