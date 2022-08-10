/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");
const Todo = require("../models/todoModels");

/********************************************************************
 *  This is a controller that handles fetching of todos per project
 ********************************************************************/
const fetchTodoByProject = asyncWrapper(async (req, res, next) => {
  const { project_id: projectId } = req.params;
  const current_user_id = await authService.getCurrentUserId(req.headers);

  const data = await Todo.find({ userId: current_user_id, projectId });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Todo fetched successfully",
    data,
  });
});

/************************************************************
 *  This is a controller that handles creation of todo item
 ************************************************************/
const createTodoItem = asyncWrapper(async (req, res, next) => {
  const { project_id: projectId } = req.params;
  const { content, labels, category } = req.body;
  const current_user_id = await authService.getCurrentUserId(req.headers);

  let data = await Todo.create({
    content,
    labels,
    category,
    projectId,
    userId: current_user_id,
  });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.created(), {
    message: "Todo created successfully",
    data,
  });
});

/***********************************************************
 *  This is a controller that handles update of todo item
 **********************************************************/
const updateTodoItem = asyncWrapper(async (req, res, next) => {
  const { todo_id } = req.params;
  const { content, labels, category } = req.body;

  const data = await Todo.findByIdAndUpdate(
    todo_id,
    { content, labels, category },
    { new: true }
  );

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Todo updated successfully",
    data,
  });
});

/***************************************************************
 *  This is a controller that handles removal of a todo item
 ***************************************************************/
const removeTodoItem = asyncWrapper(async (req, res, next) => {
  const { todo_id } = req.params;
  await Todo.findByIdAndRemove(todo_id);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Todo removed successfully",
  });
});

module.exports = {
  fetchTodoByProject,
  createTodoItem,
  updateTodoItem,
  removeTodoItem,
};
