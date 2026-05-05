const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/validateObjectId.middleware");
const { bookBodySchema } = require("../schemas/book.schema");
const c = require("../controllers/book.controller");

const router = Router();

router.get("/", c.list);
router.post("/", auth, validate(bookBodySchema), c.create);
router.put("/:id", auth, validateObjectId(), validate(bookBodySchema), c.update);
router.delete("/:id", auth, validateObjectId(), c.remove);

module.exports = router;
