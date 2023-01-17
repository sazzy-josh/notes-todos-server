const express = require("express");
const app = express();

/* IMPORT ALL MIDDLEWARES MODULES */
const loadInitialMiddleware = require("./middlewares/initialMiddlewares");
const loadFinalMiddleware = require("./middlewares/finalMiddlewares");
const loadAppRoutes = require("./routes");
const runApp = require("./runApp");

/* Loading initial middlewares. */
loadInitialMiddleware(app, express);

/* Loading all the routes of the application. */
loadAppRoutes(app);

/* Loading final middlewares. */
loadFinalMiddleware(app);

/* Starting the application. */
runApp(app);
