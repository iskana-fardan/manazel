const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const isProduction = process.env.NODE_ENV === "production";

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, requestId }) => {
    const rid = requestId ? ` [${requestId}]` : "";
    return stack
      ? `[${ts}]${rid} ${level}: ${stack}`
      : `[${ts}]${rid} ${level}: ${message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: prodFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
  exitOnError: false,
});

if (!isProduction) {
  logger.add(new winston.transports.Console({ format: devFormat }));
}

logger.exceptions.handle(
  new DailyRotateFile({
    filename: path.join(logsDir, "exceptions-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  }),
);

logger.rejections.handle(
  new DailyRotateFile({
    filename: path.join(logsDir, "rejections-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  }),
);

module.exports = logger;
