const path = require("path");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const fileUpload = require("express-fileupload");
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

/* This is setting the file upload limit to 5MB. */
const fileUploadLimit = {
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
};

/**
 * This function loads the initial middleware for the application
 * @param app - The express app
 * @param express - The express instance
 */
const loadInitialMiddleware = (app, express) => {
  app.set("trust proxy", true);
  app.use(fileUpload(fileUploadLimit));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors(setupCORSOptions));
  app.use(rateLimiter(setupRateLimiterOptions));

  app.use(express.static(path.join(__dirname, "views")));
  app.use(httpLogger("../logs/httpErrorLogs.log", true));
  app.use(httpLogger("../logs/httpLogs.log"));
};

module.exports = loadInitialMiddleware;
