const User = require("../models/User");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "Please fill in all fields. " });

  try {
    const emailExists = await User.findOne({ email });
    const phoneExists = await User.findOne({ phone });

    if (emailExists)
      return res.status(409).json({ message: "There is an error in the registration information." });

    if (phoneExists)
      return res.status(409).json({ message: "There is an error in the registration information." });

    const newUser = new User({ name, email, phone, password, role });
    await newUser.save();

    res.status(201).json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ message: "A server error occurred." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // البحث بالإيميل (غير حساس لحالة الأحرف)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) return res.status(401).json({ message: "Invalid login data" });

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid login data" });

    // إنشاء التوكن
    const token = createToken(user);

    // تحديد إعدادات الكوكي
    const cookieOptions = {
      httpOnly: true,
      secure: true, // يجب أن يكون true في الإنتاج
      sameSite: 'none', // ضروري للتواصل عبر النطاقات
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    };

    res
      .cookie("token", token, cookieOptions)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
  };
  
  res.clearCookie("token", cookieOptions).json({ message: "You are logged out" });
};

const verify = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ isAuthenticated: false });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(200).json({ isAuthenticated: false });
    }

    res.status(200).json({
      isAuthenticated: true,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        redirectPage: user.redirectPage
      }
    });
  } catch (err) {
    res.status(200).json({ isAuthenticated: false });
  }
};

const admin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

module.exports = { register, login, logout, verify, admin };