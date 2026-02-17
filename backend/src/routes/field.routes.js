const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const c = require("../controllers/field.controller");

// get the fields, for all users
router.get("/", asyncMiddleware(c.getFields));

// create a field
router.post("/", asyncMiddleware(c.createField));

// delete a field
router.delete("/:id", asyncMiddleware(c.deleteField));

// update a field
router.put("/:id", c.updateField);

module.exports = router;
