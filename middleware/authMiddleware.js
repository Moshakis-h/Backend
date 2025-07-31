// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // تأكد من استيراد نموذج المستخدم

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      isAuthenticated: false,
      message: "No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // جلب أحدث بيانات المستخدم من قاعدة البيانات
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        isAuthenticated: false,
        message: "User not found" 
      });
    }

    // إضافة أحدث بيانات المستخدم إلى req.user
    req.user = {
      id: user._id,
      role: user.role,
      redirectPage: user.redirectPage // القيمة المحدثة من قاعدة البيانات
    };

    next();
  } catch (err) {
    return res.status(403).json({ 
      isAuthenticated: false,
      message: "Invalid token" 
    });
  }
};

// ... بقية الكود
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { verifyToken, isAdmin };



