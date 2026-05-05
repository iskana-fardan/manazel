const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const config = require("./config");
const requestId = require("./middleware/requestId.middleware");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const fieldRoutes = require("./routes/field.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const bookRoutes = require("./routes/book.routes");
const contributorRoutes = require("./routes/contributor.routes");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(requestId);

if (!config.isTest) {
  app.use(
    "/api/auth/login",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: { success: false, message: "Too many login attempts, please try again later" },
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/contributors", contributorRoutes);

app.use(errorHandler);

module.exports = app;
