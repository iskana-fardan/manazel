const express = require("express");
const router = express.Router();
const c = require("../controllers/book.controller");

// get the fields, for all users
router.get("/", c.getBooks);

// create a field
router.post("/", c.createBook);

module.exports = router;
