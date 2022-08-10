const validator = require("../services/validatorService");
const asyncWrapper = require("../utils/asyncWrapper");
const { apiStatus } = require("../services/httpResponseService");
const Todo = require("../models/todoModels");

/* A middleware function that is used to validate the request body. */
const validateTodoBody = asyncWrapper(async (req, res, next) => {
  const { content, labels, category } = req.body;

  validator.body(content, "Content").required();
  validator.body(labels, "Labels").notEmpty();
  validator
    .body(category, "Category")
    .required()
    .containsOne(["backlog", "ongoing", "completed", "postponed"]);
  validator.validationFailed(next);
});

/* This is a middleware function that is used to validate the todo id. */
const validateTodoId = asyncWrapper(async (req, res, next) => {
  const { todo_id } = req.params;

  const todo_exist = await Todo.findById(todo_id);
  todo_exist ? next() : next(apiStatus.badRequest("Todo id does not exist"));
});

module.exports = {
  validateTodoBody,
  validateTodoId,
};
