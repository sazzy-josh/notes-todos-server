const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require(".");
const logger = require("../logger/appLogger");

/**
 * Connect to MongoDB using the provided connection string, and log the result
 * @param [url] - The URL to connect to MongoDB.
 */
const mongoDB = (url = MONGODB_CONNECTION_STRING) => {
  mongoose
    .connect(url)
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => {
      logger.error(`MongoDB connection error => ${err}`);

      setTimeout(() => {
        logger.error("Restarting Mongo server");
        mongoDB();
      }, 2000);
    });
};

module.exports = mongoDB;
