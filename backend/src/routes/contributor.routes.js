const express = require("express");
const router = express.Router();
const c = require("../controllers/contributor.controller");

// get all controllers
router.get("/", c.getContributors);

// create a contributor
router.post("/", c.createContributor);

// delete a contributor
router.delete("/:id", c.deleteContributor);

// update a contributor
router.put("/:id", c.updateContributor);

module.exports = router;
