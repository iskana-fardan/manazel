const { isValid } = require("mongoose").Types.ObjectId;
const AppError = require("../errors/AppError");

const validateObjectId = (param = "id") => (req, _res, next) => {
  if (!isValid(req.params[param])) return next(new AppError("Invalid ID", 400));
  next();
};

module.exports = validateObjectId;
