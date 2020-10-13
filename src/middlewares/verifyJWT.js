const jwt = require("jsonwebtoken");
const { apiError, sendErrorResponse } = require("../helpers/apiResponse");

module.exports = () => (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (authorization === undefined) {
      throw apiError("ต้องมี Authorization header");
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");

    // console.log(decoded);

    req.userId = decoded.userId;
    // console.log(req.userId);
    next();
  } catch (error) {
    if (alwaysPass) return next();

    if (error instanceof jwt.JsonWebTokenError) {
      error.status = 401;
    }
    sendErrorResponse(res, error);
  }
};
