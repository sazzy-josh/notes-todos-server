const note = require("express").Router();
const noteValidator = require("../schemaValidators/noteValidator");
const projectValidator = require("../schemaValidators/projectValidator");
const authMiddleware = require("../middlewares/authMiddlewares");
const noteController = require("../controllers/noteControllers");

/* A middleware that checks if the user is authenticated. */
note.use(authMiddleware.isAuthUser);

/* This is a route that is used to create a new note and fetch all notes. */
note
  .route("/:project_id")
  .post(
    projectValidator.validateProjectId,
    noteValidator.validateNoteBody,
    noteController.createNoteItem
  )
  .get(projectValidator.validateProjectId, noteController.fetchNoteByProject);

/* This is a route that is used to update and delete a note. */
note
  .route("/:note_id")
  .put(
    noteValidator.validateNoteId,
    noteValidator.validateNoteBody,
    noteController.updateNoteItem
  )
  .delete(noteValidator.validateNoteId, noteController.removeNoteItem);

module.exports = note;
