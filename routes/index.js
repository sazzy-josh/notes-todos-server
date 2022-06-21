const { API_VERSION } = require("../config");

const loadAppRoutes = (app) => {
  app.use(`/${API_VERSION}/auth`, require("./authRoutes"));
  app.use(`/${API_VERSION}/user`, require("./userRoutes"));
  app.use(`/${API_VERSION}/project`, require("./projectRoutes"));
  app.use(`/${API_VERSION}/note`, require("./noteRoutes"));
  app.use(`/${API_VERSION}/todo`, require("./todoRoutes"));
};

module.exports = loadAppRoutes;
