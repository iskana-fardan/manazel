const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("congrats...you made it");
});

module.exports = app;
