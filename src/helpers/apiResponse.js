exports.sendSuccessResponse = (res, data, status = 200) => {
  return res.status(status).json({
    data,
    success: true,
  });
};

exports.sendErrorResponse = (res, error, status = 500) => {
  return res.status(status).json({
    error: {
      code: status,
      ...error,
    },
    success: false,
  });
};

exports.apiError = (res, message, status = 500) => {
  const error = new Error(message);
  error.code = status;
  return res.status(status).json({
    error: {
      code: status,
      message,
    },
    success: false,
  });
};
