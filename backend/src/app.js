const express = require("express");
const fields = require("./routes/field.routes");
const roadmaps = require("./routes/roadmap.routes");
const books = require("./routes/book.routes");
const contributors = require("./routes/contributor.routes");
const app = express();

//
app.use(express.json());

// ===== routes =====

// fields
app.use("/api/fields", fields);

// roadmaps
app.use("/api/roadmaps/", roadmaps);

// contributors
app.use("/api/contributors", contributors);

// books
app.use("/api/books", books);

module.exports = app;
