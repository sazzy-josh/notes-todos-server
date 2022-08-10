const validator = require("../services/validatorService");
const asyncWrapper = require("../utils/asyncWrapper");
const { apiStatus } = require("../services/httpResponseService");
const Note = require("../models/noteModels");

/* A middleware function that is used to validate the request body. */
const validateNoteBody = asyncWrapper(async (req, res, next) => {
  const { title, content, labels } = req.body;

  validator.body(title, "Title").required();
  validator.body(content, "Content").required();
  validator.body(labels, "Labels").notEmpty();
  validator.validationFailed(next);
});

/* This is a middleware function that is used to validate the note id. */
const validateNoteId = asyncWrapper(async (req, res, next) => {
  const { note_id } = req.params;

  const note_exist = await Note.findById(note_id);
  note_exist ? next() : next(apiStatus.badRequest("Note id does not exist"));
});

module.exports = {
  validateNoteBody,
  validateNoteId,
};
