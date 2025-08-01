const jwt = require("jsonwepertoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

module.exports = createToken;