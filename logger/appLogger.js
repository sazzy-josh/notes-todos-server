const path = require("path");
const { APP_ENV } = require("../config");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

/* A custom format for the logger. */
const customFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf((info) => {
    return `[${info.timestamp}] - [${info.level.toUpperCase()}] => ${
      info.message
    }`;
  })
);

/* Creating a transport object with two properties, info and error. */
const transport = {
  info:
    APP_ENV === "development"
      ? new transports.Console({ level: "info" })
      : new transports.File({
          filename: path.join(__dirname, "../logs/applogs.log"),
          level: "info",
        }),
  error: new transports.File({
    filename: path.join(__dirname, "../logs/appErrorLogs.log"),
    level: "error",
  }),
};

const appLogger = createLogger({
  format: customFormat,
  transports: [transport.info, transport.error],
});

module.exports = appLogger;
