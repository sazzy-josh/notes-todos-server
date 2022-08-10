const { apiStatus, respondWith } = require("../services/httpResponseService");

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log("ERROR MESSAGE", error?.message);

      if (error?.code == "11000" && error?.keyValue?.email) {
        respondWith(res, apiStatus.badRequest(), {
          description: "Email already exist",
        });
        return false;
      }

      if (error?.kind === "ObjectId" && error?.path === "userId") {
        respondWith(res, apiStatus.badRequest(), {
          description: "Incorrect user fetch id",
        });
        return false;
      }

      next(error?.message);
    }
  };
};

module.exports = asyncWrapper;
