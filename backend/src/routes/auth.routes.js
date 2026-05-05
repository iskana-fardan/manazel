const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { loginSchema } = require("../schemas/auth.schema");
const c = require("../controllers/auth.controller");

const router = Router();

router.post("/login", validate(loginSchema), c.login);
router.post("/logout", c.logout);
router.get("/me", auth, c.me);

module.exports = router;
