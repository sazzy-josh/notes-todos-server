const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require(".");
const logger = require("../logger/appLogger");

const connectDB = (url = MONGODB_CONNECTION_STRING) => {
  mongoose
    .connect(url)
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => logger.error(`MongoDB connection error => ${err}`));
};

module.exports = connectDB;
