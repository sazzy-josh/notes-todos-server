const { APP_PORT } = require("./config");
const connectDB = require("./config/connectDB");
const logger = require("./logger/appLogger");

const runApp = async (app) => {
  try {
    await connectDB();
    app.listen(APP_PORT, () =>
      logger.info(`Server is running on port ${APP_PORT}`)
    );
  } catch (error) {
    logger.error(`An error occured while starting the app => ${error}`);
  }
};

module.exports = runApp;
