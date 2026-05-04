const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const c = require("../controllers/field.controller");

router.get("/", asyncMiddleware(c.getFields));
router.post("/", authMiddleware, asyncMiddleware(c.createField));
router.put("/:id", authMiddleware, asyncMiddleware(c.updateField));
router.delete("/:id", authMiddleware, asyncMiddleware(c.deleteField));

module.exports = router;
