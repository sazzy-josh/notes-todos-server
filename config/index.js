const dotenv = require("dotenv");
const path = require("path");

/* Loading the environment variables from the .env file. */
dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`),
});

/* A way to store all the environment variables in one place. */
const APP_CONFIGS = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  API_VERSION: process.env.API_VERSION,
  APP_PORT: process.env.APP_PORT,
  APP_ENV: process.env.NODE_ENV,
  APP_SECRET: process.env.APP_SECRET,

  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_DATABASE: process.env.MONGODB_DATABASE,
  MONGODB_CONNECTION_STRING: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.urrgt.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,

  MORGAN_OUTPUT_FORMAT:
    process.env.NODE_ENV === "development"
      ? "[:date[web]] ':method :url' :status :res[content-length] ':user-agent'"
      : ":remote-addr - :remote-user [:date[web]] ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent'",

  RATE_LIMIT_REQUEST: 1,
  RATE_LIMIT_REQUEST_PER_SECOND: 1000,
};

module.exports = APP_CONFIGS;
