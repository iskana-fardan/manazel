const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const c = require("../controllers/roadmap.controller");

router.get("/", asyncMiddleware(c.getAllRoadmaps));
router.get("/:fieldSlug", asyncMiddleware(c.getRoadmapByField));
router.post("/:fieldSlug", authMiddleware, asyncMiddleware(c.createRoadmap));
router.post("/:fieldSlug/:section/:levelSlug/books", authMiddleware, asyncMiddleware(c.addBookToSection));
router.delete("/:fieldSlug/:section/:levelSlug/books/:bookId", authMiddleware, asyncMiddleware(c.removeBookFromSection));

module.exports = router;
