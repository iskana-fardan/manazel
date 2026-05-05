const AppError = require("../errors/AppError");

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((e) => (e.path.length ? `${e.path.join(".")}: ${e.message}` : e.message))
      .join("; ");
    return next(new AppError(message, 400));
  }
  req.body = result.data;
  next();
};

module.exports = validate;
