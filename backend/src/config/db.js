const mongoose = require("mongoose");
const debug = require("debug")("db:startup");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    debug(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    debug(`MongoDB connection error: ${err.message}`);
    process.exit(1); // stop app kalau DB gagal
  }
};

module.exports = connectDB;
