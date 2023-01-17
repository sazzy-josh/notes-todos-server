const { APP_PORT } = require("./config");
const mongoDB = require("./config/mongoDB");
const { redisDB } = require("./config/redisDB");
const logger = require("./logger/appLogger");

/**
 * It connects to the database and starts the server
 * @param app - The express app
 */
const runApp = async (app) => {
  try {
    /* Connecting to the database. */
    mongoDB();
    redisDB();

    /* Listening to the port and logging the message. */
    app.listen(APP_PORT, () =>
      logger.info(`Server is running on port ${APP_PORT}`)
    );
  } catch (error) {
    logger.error(`An error occured while starting the app => ${error}`);
  }
};

module.exports = runApp;
