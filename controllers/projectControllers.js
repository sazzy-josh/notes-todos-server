/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const authService = require("../services/authService");

const Project = require("../models/projectModels");
const asyncWrapper = require("../utils/asyncWrapper");

/**********************************************************
 *  This is a controller that handles project creation
 **********************************************************/
const createProject = asyncWrapper(async (req, res, next) => {
  let project_data = await Project.create({ ...req.body });
  project_data.userId = await authService.getCurrentUserId(req.headers);
  project_data.save();

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Project created successfully",
  });
});

/**********************************************************
 *  This is a controller that handles fetching of project
 **********************************************************/
const fetchProject = asyncWrapper(async (req, res, next) => {
  /* Fetch all projects created by current user */
  const auth_user_id = await authService.getCurrentUserId(req.headers);
  const data = await Project.find({ userId: auth_user_id });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Project fetched successfully",
    data,
  });
});

/******************************************************
 *  This is a controller that handles project update
 ******************************************************/
const updateProject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const data = await Project.findByIdAndUpdate(
    id,
    { title, description },
    { new: true }
  );

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Project updated successfully",
    data,
  });
});

/***********************************************************
 *  This is a controller that handles project removal
 **********************************************************/
const removeProject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  await Project.findByIdAndRemove(id);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Project deleted successfully",
  });
});

module.exports = {
  createProject,
  fetchProject,
  updateProject,
  removeProject,
};
