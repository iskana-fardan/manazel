const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const error = require("./middleware/error.middleware");
const auth = require("./routes/auth.routes");
const fields = require("./routes/field.routes");
const roadmaps = require("./routes/roadmap.routes");
const books = require("./routes/book.routes");
const contributors = require("./routes/contributor.routes");

const app = express();

// ── Trust the first hop (Nginx reverse proxy) so req.ip reflects real client ─
app.set("trust proxy", 1);

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN must be set in production");
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ── Rate limiting (disabled in test to avoid shared-IP false positives) ───────
if (process.env.NODE_ENV !== "test") {
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many login attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/auth/login", loginLimiter);
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/fields", fields);
app.use("/api/roadmaps/", roadmaps);
app.use("/api/contributors", contributors);
app.use("/api/books", books);
app.use("/api/auth", auth);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(error);

module.exports = app;
