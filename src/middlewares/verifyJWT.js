const jwt = require("jsonwebtoken");
const { apiError, sendErrorResponse } = require("../helpers/apiResponse");

module.exports = () => (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (authorization === undefined) {
      apiError("ต้องมี Authorization header");
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");
    const user = decoded.user;
    req.role = user.role;
    req.userId = user.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      error.status = 401;
    }
    sendErrorResponse(res, error);
  }
};
