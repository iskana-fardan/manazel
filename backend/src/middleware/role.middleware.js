const AppError = require("../errors/AppError");

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(new AppError("Forbidden", 403));
  }
  next();
};

module.exports = requireRole;
