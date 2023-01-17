/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const fileService = require("../services/fileService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");
// const mongoose = require("mongoose");
const { PER_PAGE } = require("../config");
const { sumUpTodosAndNotes, categorizeTodos } = require("../utils/userUtils");

const User = require("../models/userModels");
const Project = require("../models/projectModels");
const Todo = require("../models/todoModels");

/***********************************************************
 *  This is a controller that handles fetching of users
 **********************************************************/
const fetchUsers = asyncWrapper(async (req, res, next) => {
  let { page = 1, search } = req.query;
  let page_offset = (page - 1) * PER_PAGE;

  /* A query that is used to filter users based on the search query. */
  let filter_query = search
    ? {
        $or: [
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { role: new RegExp(search, "i") },
        ],
      }
    : {};

  /* Fetch all users on the system */
  let [total, users] = await Promise.all([
    User.countDocuments(filter_query),
    User.find(filter_query)
      .populate("projects")
      .populate("todos")
      .populate("notes")
      .sort("-createdAt")
      .limit(PER_PAGE)
      .skip(page_offset)
      .select("-updatedAt"),
  ]);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "Users fetched successfully",
    ...authService.renderPaginatedPayload(users, { total, page }),
  });
});

/**********************************************************
 *  This is a controller that fetches single user detail
 **********************************************************/
const fetchSingleUser = asyncWrapper(async (req, res, next) => {
  const user_id = req.params?.id;
  const auth_user_id = await authService.getCurrentUserId(req.headers);
  const user_filter_id = user_id ? user_id : auth_user_id;

  let data = await User.findById(user_filter_id)
    .populate("projects")
    .populate("todos")
    .populate("notes")
    .select("-updatedAt -createdAt");

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User details fetched successfully",
    data,
  });
});

/**********************************************************
 *  This is a controller that fetches dashboard summary
 **********************************************************/
const fetchDashboardSummary = asyncWrapper(async (req, res, next) => {
  const auth_user_id = await authService.getCurrentUserId(req.headers);

  let [user, projects, todos] = await Promise.all([
    User.findById(auth_user_id)
      .populate("projects")
      .populate("todos")
      .populate("notes")
      .select(
        "-updatedAt -createdAt -email -firstName -lastName -picture -role"
      ),
    Project.find({ userId: auth_user_id })
      .populate("todos")
      .populate("notes")
      .sort("-createdAt")
      .limit(4)
      .select("-updatedAt -createdAt -archived -userId -description"),
    Todo.find({ userId: auth_user_id }).select(
      "-updatedAt -createdAt -projectId -userId -content -labels -title"
    ),
  ]);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User dashboard fetched successfully",
    data: {
      user,
      projects: sumUpTodosAndNotes(projects),
      todos: categorizeTodos(todos),
    },
  });
});

/***********************************************************
 *  This is a controller that handles user update.
 **********************************************************/
const updateUser = asyncWrapper(async (req, res, next) => {
  const auth_user_id = await authService.getCurrentUserId(req.headers);

  const { fullName, image } = req.body;
  const [firstName, lastName] = fullName.split(" ");
  // const image = req.files?.image;

  let picture = "";
  let updatePayload = { firstName, lastName };

  if (image) {
    let { public_id, secure_url } = await fileService.fileUpload(image, next);
    picture = { id: public_id, url: secure_url };
    updatePayload.picture = picture;
  }

  let user = await User.findById(auth_user_id);
  if (user.picture?.url && image)
    await fileService.removeUploadedImageCloudFile(user.picture?.id);

  user.firstName = updatePayload.firstName;
  user.lastName = updatePayload.lastName;
  image ? (user.picture = updatePayload.picture) : null;
  user.save();

  let data = authService.renderUserPayload(user);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User updated successfully",
    data,
  });
});

/***********************************************************
 *  This is a controller that handles user role update
 **********************************************************/
const updateUserRole = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  let data = await User.findByIdAndUpdate(id, { role }, { new: true });
  data = authService.renderUserPayload(data);

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User role updated successfully",
    data,
  });
});

/***********************************************************
 *  This is a controller that handles user role update.
 **********************************************************/
const removeUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  /* Deleting the user's profile picture from cloudinary. */
  const deleted_user = await User.findById(id);
  if (deleted_user.picture?.id) {
    const id = deleted_user.picture.id;
    await fileService.removeUploadedImageCloudFile(id);
  }

  /* Deleting all projects that belong to the user. */
  await User.findByIdAndRemove(id);
  await Project.deleteMany({ userId: id });

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User removed successfully",
  });
});

module.exports = {
  fetchUsers,
  fetchSingleUser,
  fetchDashboardSummary,
  updateUser,
  updateUserRole,
  removeUser,
};
