const express = require("express");
const router = express.Router();
const c = require("../controllers/field.controller");

// get the fields, for all users
router.get("/", c.getFields);

// create a field
router.post("/", c.createField);

module.exports = router;
