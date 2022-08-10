/***********************************************************
 *  Import all app services, models and utils as needed.
 **********************************************************/
const { apiStatus, respondWith } = require("../services/httpResponseService");
const fileService = require("../services/fileService");
const authService = require("../services/authService");
const asyncWrapper = require("../utils/asyncWrapper");

const User = require("../models/userModels");
const Project = require("../models/projectModels");

/***********************************************************
 *  This is a controller that handles fetching of users
 **********************************************************/
const fetchUsers = asyncWrapper(async (req, res, next) => {
  /* Fetch all users on the system */
  let users = await User.find({});
  users = users.map((user) => authService.renderUserPayload(user));

  /* A function that returns a response to the user. */
  respondWith(res, apiStatus.success(), {
    message: "User fetched successfully",
    users,
  });
});

/***********************************************************
 *  This is a controller that handles user update.
 **********************************************************/
const updateUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  const image = req.files?.image;

  let picture = "";
  let updatePayload = { firstName, lastName };

  if (image) {
    let { public_id, secure_url } = await fileService.fileUpload(image);
    picture = { id: public_id, url: secure_url };
    updatePayload.picture = picture;
  }

  let user = await User.findById(id);
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
  if (deleted_user.picture) {
    const { id } = JSON.parse(deleted_user.picture);
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
  updateUser,
  updateUserRole,
  removeUser,
};
