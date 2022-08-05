const {
  ApiResponse,
  apiStatus,
  respondWith,
} = require("../services/httpResponseService");
const logger = require("../logger/appLogger");

const errorHandler = (err, req, res, next) => {
  /* Logging error to error logs. */
  logger.error(err);

  /* Check if error is an instance of ApiResponse, else return an Internal server error */
  return err instanceof ApiResponse
    ? respondWith(res, err)
    : respondWith(res, apiStatus.internal());
};

module.exports = errorHandler;
