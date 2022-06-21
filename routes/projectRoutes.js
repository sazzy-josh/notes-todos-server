const project = require("express").Router();

project.route("/").get((req, res) => {
  res.send("Project route");
});

module.exports = project;
