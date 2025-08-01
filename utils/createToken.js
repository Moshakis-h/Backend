const jwt = require("jsonwebtoken");

const createToken = (user) => {
  try {
    if (!user || !user._id) {
      return null;
    }
    
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
  } catch (err) {
    return null;
  }
};

module.exports = createToken;