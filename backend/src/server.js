const dotenv = require("dotenv");
dotenv.config();

const logger = require("./startup/logging");
const app = require("./app");
const connectDB = require("./startup/db");

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
