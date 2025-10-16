/**
 * Custom Error class for handling API-specific errors.
 */
class ApiError extends Error {
  /**
   * HTTP status code associated with the error.
   */

  constructor(code, message, stack = '') {
    super(message);

    // Set the HTTP status code for the error
    this.statusCode = code;
    // console.log(message);
    // Set the call stack for the error, if provided; otherwise, capture the stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
