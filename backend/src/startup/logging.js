const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// 1. Setup Logs Directory
const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 2. Environment
const isProduction = process.env.NODE_ENV === "production";

const level = isProduction ? "info" : "debug";

// 3. Formats
const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

// 4. Create Logger
const logger = winston.createLogger({
  level,
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

// 5. Console Transport (Dev Only)
if (!isProduction) {
  logger.add(
    new winston.transports.Console({
      format: devFormat,
    }),
  );
}

// 6. Handle Uncaught Exceptions
logger.exceptions.handle(
  new DailyRotateFile({
    filename: path.join(logsDir, "exceptions-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  }),
);

// 7. Handle Unhandled Rejections
logger.rejections.handle(
  new DailyRotateFile({
    filename: path.join(logsDir, "rejections-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  }),
);

module.exports = logger;
