const mongoose = require("mongoose");
const logger = require("./logging");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.info(`MongoDB connection error: ${err.message}`);
    process.exit(1); // stop app kalau DB gagal
  }
};

module.exports = connectDB;
