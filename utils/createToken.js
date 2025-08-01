const jwt = require("jsonwebtoken");

const createToken = (user) => {
  try {
    if (!user || !user._id) {
      console.error("Invalid user object for token creation");
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
    console.error('Token creation error:', err);
    return null;
  }
};

module.exports = createToken;