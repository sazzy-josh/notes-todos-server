const { APP_ENV } = require("../config");
const httpStatus = require("../utils/httpStatus");

class ApiResponse extends Error {
  /**
   * APIResponse class constructor
   * @param status - HTTP status
   * @param code - The status code.
   * @param message - The status message
   * @param error - The descriptive error message
   */
  constructor(status, code, message, error) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * It takes an API response object and returns an ApiResponse object
   * @param response - The response object returned by the API.
   * @returns An ApiResponse object.
   */
  static renderApiResponse(response, error = "") {
    return new ApiResponse(
      response.code >= 400 ? "error" : "success",
      response.code,
      response.message,
      error
    );
  }
}

/* An http status object that returns http responses */
const apiStatus = {
  /* 2** status responses */
  success: () => ApiResponse.renderApiResponse(httpStatus.success),
  created: () => ApiResponse.renderApiResponse(httpStatus.created),
  noContent: () => ApiResponse.renderApiResponse(httpStatus.noContent),

  /* 4** status responses */
  badRequest: (error) =>
    ApiResponse.renderApiResponse(httpStatus.badRequest, error),
  unauthorized: (error) =>
    ApiResponse.renderApiResponse(httpStatus.unauthorized, error),
  forbidden: (error) =>
    ApiResponse.renderApiResponse(httpStatus.forbidden, error),
  notFound: (error) =>
    ApiResponse.renderApiResponse(httpStatus.notFound, error),
  noMethod: (error) =>
    ApiResponse.renderApiResponse(httpStatus.noMethod, error),
  conflict: (error) =>
    ApiResponse.renderApiResponse(httpStatus.conflict, error),
  unProcessable: (error) =>
    ApiResponse.renderApiResponse(httpStatus.unProcessable, error),
  manyRequest: (error) =>
    ApiResponse.renderApiResponse(httpStatus.manyRequest, error),

  /* 5** status responses */
  internal: (error) =>
    ApiResponse.renderApiResponse(httpStatus.internal, error),
};

const respondWith = (res, responseData, extraData = {}) => {
  /* Creating a new object with the properties of the object passed in as extraData. */
  let payload = {
    status: responseData?.status,
    code: responseData?.code,
    message: responseData?.message,
    ...extraData,
  };

  responseData?.error ? (payload.error = responseData?.error) : null;

  /* If the APP_ENV is set to development, then the stack trace will be added to the payload. */
  APP_ENV === "development" && payload.status === "Error"
    ? (payload.stack = responseData?.stack)
    : null;

  /* Sending a response to the client with the status code and the payload. */
  res.status(responseData?.code).json(payload);
  return false;
};

module.exports = {
  ApiResponse,
  apiStatus,
  respondWith,
};
