const express = require("express");
const app = express();

/* IMPORT ALL MIDDLEWARES MODULES */
const loadInitialMiddleware = require("./middlewares/initialMiddlewares");
const loadAppRoutes = require("./routes");
const runApp = require("./runApp");

/* Loading the initial middlewares. */
loadInitialMiddleware(app, express);

/* Loading the routes from the routes folder. */
loadAppRoutes(app);

/* Starting the application. */
runApp(app);
