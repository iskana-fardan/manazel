const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { addBookSchema } = require("../schemas/roadmap.schema");
const c = require("../controllers/roadmap.controller");

const router = Router();

router.get("/", c.list);
router.get("/:fieldSlug", c.getByField);
router.post("/:fieldSlug", auth, c.create);
router.post("/:fieldSlug/:section/:levelSlug/books", auth, validate(addBookSchema), c.addBook);
router.delete("/:fieldSlug/:section/:levelSlug/books/:bookId", auth, c.removeBook);

module.exports = router;
