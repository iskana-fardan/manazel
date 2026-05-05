require("dotenv").config();

const config = require("./config");

if (!config.mongo.uri) {
  console.error("MONGO_URI is required");
  process.exit(1);
}
if (!config.jwt.secret || config.jwt.secret.length < 16) {
  console.error("JWT_SECRET must be at least 16 characters");
  process.exit(1);
}
if (config.isProduction && !process.env.CORS_ORIGIN) {
  console.error("CORS_ORIGIN must be set in production");
  process.exit(1);
}

const logger = require("./startup/logging");
const connectDB = require("./startup/db");
const app = require("./app");

connectDB().then(() => {
  app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`, { env: config.env });
  });
});
