const { apiStatus, respondWith } = require("../services/httpResponseService");

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (error.code == "11000" && error.keyValue.email) {
        respondWith(res, apiStatus.badRequest(), {
          description: "Email already exist",
        });
        return false;
      }

      next(error);
    }
  };
};

module.exports = asyncWrapper;
