const jwt = require("jsonwebtoken");
// const { JWT_KEY, JWT_EXPIRE_TIME } = process.env;

const genJWT = (userId, isAdmin = false) => {
  return jwt.sign(
    {
      userId: userId,
      isAdmin: isAdmin,
    },
    "secret_key",
    {
      //   expiresIn: "1d",
    }
  );
};

module.exports = genJWT;
