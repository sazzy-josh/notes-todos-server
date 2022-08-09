const project = require("express").Router();
const projectValidator = require("../schemaValidators/projectValidator");
const authMiddleware = require("../middlewares/authMiddlewares");
const projectController = require("../controllers/projectControllers");

/* A middleware that checks if the user is authenticated. */
project.use(authMiddleware.isAuthUser);

/* This is a route that is used to create a new project and fetch all projects. */
project
  .route("/")
  .post(projectValidator.validateProjectBody, projectController.createProject)
  .get(projectController.fetchProject);

/* This is a route that is used to update and delete a project. */
project
  .route("/:id")
  .put(
    projectValidator.validateProjectId,
    projectValidator.validateProjectBody,
    projectController.updateProject
  )
  .delete(projectValidator.validateProjectId, projectController.removeProject);

module.exports = project;
