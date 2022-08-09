const note = require("express").Router();
const authValidator = require("../schemaValidators/authValidator");
const authMiddleware = require("../middlewares/authMiddlewares");
const noteController = require("../controllers/noteControllers");

note.route("/").get((req, res) => {
  res.send("Note route");
});

module.exports = note;
