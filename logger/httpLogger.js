const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { MORGAN_OUTPUT_FORMAT } = require("../config");

/**
 * It returns a middleware function that logs HTTP requests to a file
 * @param file_path - The path to the file where the logs will be written.
 * @param [allow_skip=false] - If true, then the logger will skip logging requests that have a status
 * code of 400 or less.
 * @returns A function that takes two parameters, file_path and allow_skip.
 */
const httpLogger = (file_path, allow_skip = false) => {
  return morgan(MORGAN_OUTPUT_FORMAT, {
    skip: allow_skip ? (_, res) => res.statusCode <= 400 : false,
    stream: fs.createWriteStream(path.join(__dirname, file_path), {
      flags: "a",
    }),
  });
};

module.exports = httpLogger;
