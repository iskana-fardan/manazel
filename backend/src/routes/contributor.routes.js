const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/validateObjectId.middleware");
const { contributorBodySchema } = require("../schemas/contributor.schema");
const c = require("../controllers/contributor.controller");

const router = Router();

router.get("/", c.list);
router.post("/", auth, validate(contributorBodySchema), c.create);
router.put("/:id", auth, validateObjectId(), validate(contributorBodySchema), c.update);
router.delete("/:id", auth, validateObjectId(), c.remove);

module.exports = router;
