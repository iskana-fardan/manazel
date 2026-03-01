const express = require("express");
const router = express.Router();
const c = require("../controllers/book.controller");

// get the books, for all users
router.get("/", c.getBooks);

// create a book
router.post("/", c.createBook);

// delete a book
router.delete("/:id", c.deleteBook);

// update a book
router.put("/:id", c.updateBook);

module.exports = router;
