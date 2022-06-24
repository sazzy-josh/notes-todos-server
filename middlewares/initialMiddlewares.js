const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const httpLogger = require("../logger/httpLogger");
const {
  ALLOWED_ORIGINS,
  RATE_LIMIT_REQUEST,
  RATE_LIMIT_REQUEST_PER_SECOND,
} = require("../config");

/* Setting up the CORS options for the application. */
const setupCORSOptions = {
  origin: ALLOWED_ORIGINS,
};

/* Setting up the rate limiter options for the application. */
const setupRateLimiterOptions = {
  windowMs: RATE_LIMIT_REQUEST_PER_SECOND,
  max: RATE_LIMIT_REQUEST,
};

/**
 * This function loads the initial middleware for the application
 * @param app - The express app
 * @param express - The express instance
 */
const loadInitialMiddleware = (app, express) => {
  app.set("trust proxy", true);
  app.use(cors(setupCORSOptions));
  app.use(rateLimiter(setupRateLimiterOptions));

  app.use(express.json());
  app.use(httpLogger("../logs/httpErrorLogs.log", true));
  app.use(httpLogger("../logs/httpLogs.log"));
};

module.exports = loadInitialMiddleware;
