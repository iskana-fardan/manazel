const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const c = require("../controllers/book.controller");

router.get("/", asyncMiddleware(c.getBooks));
router.post("/", authMiddleware, asyncMiddleware(c.createBook));
router.put("/:id", authMiddleware, asyncMiddleware(c.updateBook));
router.delete("/:id", authMiddleware, asyncMiddleware(c.deleteBook));

module.exports = router;
