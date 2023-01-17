/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");
const Note = require("../models/noteModels");

/********************************************************************
 *  This is a controller that handles fetching of notes per project
 ********************************************************************/
const fetchNoteByProject = asyncWrapper(async (req, res, next) => {
  const { project_id: projectId } = req.params;
  const { search } = req.query;

  const current_user_id = await authService.getCurrentUserId(req.headers);

  let filter_query = search
    ? {
        $or: [
          { title: new RegExp(search, "i") },
          { content: new RegExp(search, "i") },
          { theme: new RegExp(search, "i") },
          { labels: new RegExp(search, "i") },
        ],
      }
    : {};

  const data = await Note.find({
    userId: current_user_id,
    projectId,
    ...filter_query,
  });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Note fetched successfully",
    data,
  });
});

/************************************************************
 *  This is a controller that handles creation of note item
 ************************************************************/
const createNoteItem = asyncWrapper(async (req, res, next) => {
  const { project_id: projectId } = req.params;
  const { title, content, labels, theme } = req.body;
  const current_user_id = await authService.getCurrentUserId(req.headers);

  let data = await Note.create({
    title,
    content,
    labels,
    theme,
    projectId,
    userId: current_user_id,
  });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.created(), {
    message: "Note created successfully",
    data,
  });
});

/***********************************************************
 *  This is a controller that handles update of note item
 **********************************************************/
const updateNoteItem = asyncWrapper(async (req, res, next) => {
  const { note_id } = req.params;
  const { title, content, labels, theme } = req.body;

  const data = await Note.findByIdAndUpdate(
    note_id,
    { title, content, labels, theme },
    { new: true }
  );

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Note updated successfully",
    data,
  });
});

/***************************************************************
 *  This is a controller that handles removal of a note item
 ***************************************************************/
const removeNoteItem = asyncWrapper(async (req, res, next) => {
  const { note_id } = req.params;
  await Note.findByIdAndRemove(note_id);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Note removed successfully",
  });
});

module.exports = {
  fetchNoteByProject,
  createNoteItem,
  updateNoteItem,
  removeNoteItem,
};
