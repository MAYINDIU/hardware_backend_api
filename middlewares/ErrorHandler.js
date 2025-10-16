
const config = require("../config/db.js");
const ApiError = require("../errors/APIError.js");

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (error, req, res, next) => {
  let statusCode = 404;
  let message = "Something went wrong!";
  let errorMessages = [];

  if (error instanceof ApiError) {
    statusCode = error ? error.statusCode : statusCode;
    message = error && error.message ? error.message : "An error occurred";
    errorMessages =
      error && error.message ? [{ path: "", message: error.message }] : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error.stack : undefined,
  });
};

module.exports = ErrorHandler;
