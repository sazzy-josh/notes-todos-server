const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`),
});

const APP_PORT = process.env.APP_PORT;
const APP_ENV = process.env.NODE_ENV;
const API_VERSION = process.env.API_VERSION;

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const MONGODB_CONNECTION_STRING = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.urrgt.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`;

const MORGAN_OUTPUT_FORMAT =
  APP_ENV === "development"
    ? "[:date[web]] ':method :url' :status :res[content-length] ':user-agent'"
    : ":remote-addr - :remote-user [:date[web]] ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent'";

module.exports = {
  APP_PORT,
  APP_ENV,
  API_VERSION,
  MONGODB_CONNECTION_STRING,
  MORGAN_OUTPUT_FORMAT,
};
