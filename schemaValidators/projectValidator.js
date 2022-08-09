const validator = require("../services/validatorService");
const asyncWrapper = require("../utils/asyncWrapper");
const Project = require("../models/projectModels");
const { apiStatus } = require("../services/httpResponseService");

/* A middleware function that is used to validate the request body. */
const validateProjectBody = asyncWrapper(async (req, res, next) => {
  const { title } = req.body;

  validator.body(title, "title").required().minLength(3);
  validator.validationFailed(next);
});

/* This is a middleware function that is used to validate the project id. */
const validateProjectId = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const project_exist = await Project.findById(id);
  project_exist
    ? next()
    : next(apiStatus.badRequest("Project id does not exist"));
});

module.exports = {
  validateProjectBody,
  validateProjectId,
};
