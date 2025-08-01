const express = require("express");
const router = express.Router();
const { register, login, logout, verify, admin } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify", verifyToken, verify);
router.get("/admin", verifyToken, admin);

module.exports = router;