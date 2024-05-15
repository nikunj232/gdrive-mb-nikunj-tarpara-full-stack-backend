class ApiError extends Error {
    constructor(statusCode, validationMsg, req, isOperational = true, stack = "") {
        super(req ? validationMsg : validationMsg)
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
  
module.exports = ApiError;
  