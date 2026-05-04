const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const c = require("../controllers/contributor.controller");

router.get("/", asyncMiddleware(c.getContributors));
router.post("/", authMiddleware, asyncMiddleware(c.createContributor));
router.put("/:id", authMiddleware, asyncMiddleware(c.updateContributor));
router.delete("/:id", authMiddleware, asyncMiddleware(c.deleteContributor));

module.exports = router;
