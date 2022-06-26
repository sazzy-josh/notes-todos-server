const { APP_ENV } = require("../config");
const httpStatus = require("../utils/httpStatus");

class ApiResponse extends Error {
  /**
   * APIResponse class constructor
   * @param status - HTTP status
   * @param code - The status code.
   * @param message - The status message
   */
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * It takes an API response object and returns an ApiResponse object
   * @param response - The response object returned by the API.
   * @returns An ApiResponse object.
   */
  static renderApiResponse(response, description = "") {
    return new ApiResponse(
      response.code >= 400 ? "Error" : "Success",
      response.code,
      response.message,
      description
    );
  }
}

/* An http status object that returns http responses */
const httpResponse = {
  /* 2** status responses */
  success: () => ApiResponse.renderApiResponse(httpStatus.success),
  created: () => ApiResponse.renderApiResponse(httpStatus.created),
  noContent: () => ApiResponse.renderApiResponse(httpStatus.noContent),

  /* 4** status responses */
  badRequest: () => ApiResponse.renderApiResponse(httpStatus.badRequest),
  unauthorized: () => ApiResponse.renderApiResponse(httpStatus.unauthorized),
  forbidden: () => ApiResponse.renderApiResponse(httpStatus.forbidden),
  notFound: () => ApiResponse.renderApiResponse(httpStatus.notFound),
  noMethod: () => ApiResponse.renderApiResponse(httpStatus.noMethod),
  unProcessable: () => ApiResponse.renderApiResponse(httpStatus.unProcessable),
  manyRequest: () => ApiResponse.renderApiResponse(httpStatus.manyRequest),

  /* 5** status responses */
  internal: () => ApiResponse.renderApiResponse(httpStatus.internal),
};

const responsePayload = (res, responseData, extraData = {}) => {
  /* Creating a new object with the properties of the object passed in as extraData. */
  let payload = {
    status: responseData?.status,
    code: responseData?.code,
    message: responseData?.message,
    ...extraData,
  };

  /* If the APP_ENV is set to development, then the stack trace will be added to the payload. */
  APP_ENV === "development" && payload.status === "Error"
    ? (payload.stack = responseData?.stack)
    : null;

  /* Sending a response to the client with the status code and the payload. */
  res.status(responseData?.code).json(payload);
  return;
};

module.exports = {
  ApiResponse,
  httpResponse,
  responsePayload,
};
