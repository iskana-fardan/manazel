const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" }),
);

winston.rejections.handle(
  new winston.transports.File({ filename: "uncaughtRejections.log" }),
);

module.exports = logger;
