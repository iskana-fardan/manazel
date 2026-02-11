const express = require("express");
const router = express.Router();
const c = require("../controllers/contributor.controller");

// get all controllers
router.get("/", c.getContributors);
router.post("/", c.createContributor);

module.exports = router;
