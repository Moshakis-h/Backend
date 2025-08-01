const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/user", verifyToken, async (req, res) => {
  try {
    res.status(200).json({ 
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        redirectPage: req.user.redirectPage
      }
    });
  } catch (err) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;