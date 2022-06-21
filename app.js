const express = require("express");
const app = express();

// ROUTES AND MIDDLEWARES IMPORTS
const httpLogger = require("./logger/httpLogger");
const loadAppRoutes = require("./routes");
const runApp = require("./runApp");

// INITIAL APP MIDDLEWARE
app.use(express.json());
app.use(httpLogger("../logs/httpErrorLogs.log", true));
app.use(httpLogger("../logs/httpLogs.log"));

// APP ROUTES
loadAppRoutes(app);

// START APPLICATION
runApp(app);
