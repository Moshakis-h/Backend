const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User"); // تأكد من استيراد نموذج المستخدم

router.get("/user", verifyToken, async (req, res) => {
  try {
    // جلب أحدث بيانات المستخدم من قاعدة البيانات
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    
    res.status(200).json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        redirectPage: user.redirectPage // القيمة المحدثة من قاعدة البيانات
      }
    });
  } catch (err) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// ... بقية الكود