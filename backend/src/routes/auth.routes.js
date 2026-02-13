const express = require("express");
const router = express.Router();
const authController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
