const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { MORGAN_OUTPUT_FORMAT } = require("../config");

const httpLogger = (file_path, allow_skip = false) => {
  return morgan(MORGAN_OUTPUT_FORMAT, {
    skip: allow_skip ? (_, res) => res.statusCode <= 400 : false,
    stream: fs.createWriteStream(path.join(__dirname, file_path), {
      flags: "a",
    }),
  });
};

module.exports = httpLogger;
