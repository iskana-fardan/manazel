const express = require("express");
const router = express.Router();
const c = require("../controllers/roadmap.controller");

// get roadmap by field
router.get("/:fieldSlug", c.getRoadmapByField);

module.exports = router;
