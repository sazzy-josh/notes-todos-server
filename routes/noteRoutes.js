const note = require("express").Router();

note.route("/").get((req, res) => {
  res.send("Note route");
});

module.exports = note;
