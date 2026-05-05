const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/validateObjectId.middleware");
const { fieldBodySchema } = require("../schemas/field.schema");
const c = require("../controllers/field.controller");

const router = Router();

router.get("/", c.list);
router.post("/", auth, validate(fieldBodySchema), c.create);
router.put("/:id", auth, validateObjectId(), validate(fieldBodySchema), c.update);
router.delete("/:id", auth, validateObjectId(), c.remove);

module.exports = router;
