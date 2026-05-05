const mongoose = require("mongoose");
const config = require("../config");
const logger = require("./logging");

const connectDB = async () => {
  const conn = await mongoose.connect(config.mongo.uri);
  logger.info(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
