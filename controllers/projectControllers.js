/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");
const { PER_PAGE } = require("../config");

const Project = require("../models/projectModels");

/**********************************************************
 *  This is a controller that handles project creation
 **********************************************************/
const createProject = asyncWrapper(async (req, res, next) => {
  let data = await Project.create({ ...req.body });
  data.userId = await authService.getCurrentUserId(req.headers);
  data.save();

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.created(), {
    message: "Project created successfully",
    data,
  });
});

/**********************************************************
 *  This is a controller that handles fetching of project
 **********************************************************/
const fetchProject = asyncWrapper(async (req, res, next) => {
  let { page = 1, search } = req.query;
  let page_offset = (page - 1) * PER_PAGE;

  /* Getting the current user id from the request header. */
  const auth_user_id = await authService.getCurrentUserId(req.headers);

  /* A query that is used to filter users based on the search query. */
  let filter_query = search
    ? {
        $and: [
          {
            $or: [
              { title: new RegExp(search, "i") },
              { description: new RegExp(search, "i") },
            ],
          },
          { userId: auth_user_id },
        ],
      }
    : { userId: auth_user_id };

  /* Fetch all projects created by current user */
  let [total, projects] = await Promise.all([
    Project.countDocuments(filter_query),
    Project.find(filter_query)
      .populate("todos")
      .populate("notes")
      .sort("-createdAt")
      .limit(PER_PAGE)
      .skip(page_offset)
      .select("-updatedAt -archived -userId -id"),
  ]);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Project fetched successfully",
    ...authService.renderPaginatedPayload(projects, { total, page }),
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
