const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true
    });
    return res.status(200).json({ isAuthenticated: false });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = { verifyToken, isAdmin };