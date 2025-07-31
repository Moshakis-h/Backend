const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// routes/protected.js
router.get("/user", verifyToken, async (req, res) => {
  try {
    // الآن req.user يحتوي على أحدث البيانات من قاعدة البيانات
    res.status(200).json({ 
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        redirectPage: req.user.redirectPage // القيمة المحدثة
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



