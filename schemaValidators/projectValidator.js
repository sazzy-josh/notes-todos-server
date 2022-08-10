const { apiStatus } = require("../services/httpResponseService");
const validator = require("../services/validatorService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");

const Project = require("../models/projectModels");

/* A middleware function that is used to validate the request body. */
const validateProjectBody = asyncWrapper(async (req, res, next) => {
  const { title } = req.body;

  validator.body(title, "title").required().minLength(3);
  validator.validationFailed(next);
});

/* This is a middleware function that is used to validate the project id. */
const validateProjectId = asyncWrapper(async (req, res, next) => {
  const id = req.params?.id ?? req.params?.project_id;
  const user_id = await authService.getCurrentUserId(req.headers);

  const project_exist = await Project.findById(id);
  const is_project_owner = project_exist.userId.toString() === user_id;

  project_exist
    ? is_project_owner
      ? next()
      : next(apiStatus.badRequest("Not authorized to modify project"))
    : next(apiStatus.badRequest("Project id does not exist"));
});

module.exports = {
  validateProjectBody,
  validateProjectId,
};
