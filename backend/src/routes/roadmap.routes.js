const express = require("express");
const router = express.Router();
const c = require("../controllers/roadmap.controller");

router.get("/", c.getAllRoadmaps);
router.get("/:fieldSlug", c.getRoadmapByField);
router.post("/:fieldSlug", c.createRoadmap);
router.post("/:fieldSlug/:section/:levelSlug/books", c.addBookToSection);
router.delete("/:fieldSlug/:section/:levelSlug/books/:bookId", c.removeBookFromSection);

module.exports = router;
