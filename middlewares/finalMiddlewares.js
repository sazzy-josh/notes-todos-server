const listEndpoints = require("express-list-endpoints");
const notFoundHandler = require("./notFoundHandler");
const errorHandler = require("./errorHandler");

const loadFinalMiddlewares = (app) => {
  /* A middleware that will catch any request that is not handled by any other middleware. */
  app.all("*", (req, res, next) =>
    notFoundHandler(req, res, next, listEndpoints(app))
  );

  /* A middleware that will catch any error that is thrown in the application. */
  app.use(errorHandler);
};

module.exports = loadFinalMiddlewares;
