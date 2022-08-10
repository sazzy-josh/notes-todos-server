const todo = require("express").Router();
const todoValidator = require("../schemaValidators/todoValidator");
const projectValidator = require("../schemaValidators/projectValidator");
const authMiddleware = require("../middlewares/authMiddlewares");
const todoController = require("../controllers/todoControllers");

/* A middleware that checks if the user is authenticated. */
todo.use(authMiddleware.isAuthUser);

/* This is a route that is used to create a new project and fetch all projects. */
todo
  .route("/:project_id")
  .post(
    projectValidator.validateProjectId,
    todoValidator.validateTodoBody,
    todoController.createTodoItem
  )
  .get(projectValidator.validateProjectId, todoController.fetchTodoByProject);

/* This is a route that is used to update and delete a todo. */
todo
  .route("/:todo_id")
  .put(
    todoValidator.validateTodoId,
    todoValidator.validateTodoBody,
    todoController.updateTodoItem
  )
  .delete(todoValidator.validateTodoId, todoController.removeTodoItem);

module.exports = todo;
