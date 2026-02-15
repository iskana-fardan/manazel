const express = require("express");
const auth = require("./routes/auth.routes");
const fields = require("./routes/field.routes");
const roadmaps = require("./routes/roadmap.routes");
const books = require("./routes/book.routes");
const contributors = require("./routes/contributor.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// global middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// ===== routes =====

// fields
app.use("/api/fields", fields);

// roadmaps
app.use("/api/roadmaps/", roadmaps);

// contributors
app.use("/api/contributors", contributors);

// books
app.use("/api/books", books);

// auth
app.use("/api/auth", auth);

module.exports = app;
