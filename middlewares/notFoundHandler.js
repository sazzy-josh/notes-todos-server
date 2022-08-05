const { apiStatus } = require("../services/httpResponseService");

const notFoundHandler = (req, res, next, routes) => {
  /* Checking if the path exists in the routes array. */
  let pathExists = routes.find((path) => path.path === req.url);

  /* If path exists, return 405 error, else return 404 error. */
  pathExists !== undefined
    ? next(apiStatus.noMethod())
    : next(apiStatus.notFound());
};

module.exports = notFoundHandler;
