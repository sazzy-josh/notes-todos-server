const todo = require("express").Router();

todo.route("/").get((req, res) => {
  res.send("Todo route");
});

module.exports = todo;
