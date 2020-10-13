const jwt = require("jsonwebtoken");
// const { JWT_KEY, JWT_EXPIRE_TIME } = process.env;

const genJWT = (user) => {
  return jwt.sign(
    {
      user: user,
    },
    "secret_key",
    {
      expiresIn: "7d",
    }
  );
};

module.exports = genJWT;
