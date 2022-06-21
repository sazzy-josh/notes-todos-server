const user = require("express").Router();

user.route("/").get((req, res) => {
  res.send("User route");
});

module.exports = user;
