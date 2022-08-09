const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");
const { apiStatus } = require("../services/httpResponseService");
const { redisClient } = require("../config/redisDB");

/* Checking if the user is a guest user. If the user is a guest user, it will call the next function.
If the user is not a guest user, it will call the next function with an error. */
const isGuestUser = asyncWrapper(async (req, res, next) => {
  const bearerToken = req.headers["authorization"];

  typeof bearerToken === "undefined" || bearerToken === "Bearer null"
    ? next()
    : next(apiStatus.unProcessable("Can't access route when authenticated"));
});

/* Checking if the user is authenticated. If the user is authenticated, it will call the next function.
If the user is not authenticated, it will call the next function with an error. */
const isAuthUser = asyncWrapper(async (req, res, next) => {
  let bearerToken = req.headers["authorization"];

  if (typeof bearerToken === "undefined") next(apiStatus.unauthorized());
  else {
    let token = bearerToken.split(" ")[1];
    let verified_token = await authService.verifyToken(token);

    if (["jwt expired", "invalid signature"].includes(verified_token))
      next(apiStatus.forbidden());
    else if (await redisClient.get(`black-list-${token}`))
      next(apiStatus.unauthorized());
    else {
      req.payload = {
        ttl: verified_token.exp - verified_token.iat,
        token,
      };
    }
    next();
  }
});

module.exports = {
  isGuestUser,
  isAuthUser,
};
