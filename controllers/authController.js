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
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) return res.status(401).json({ message: "Invalid login data" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid login data" });

    const token = createToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // أضف هذا السطر
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  res.json({ message: "You are logged out" });
};

const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.json({ isAuthenticated: false });
    }

    res.json({
      isAuthenticated: true,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // أضف هذا السطر
        redirectPage: user.redirectPage
      }
    });
  } catch (err) {
    res.json({ isAuthenticated: false });
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